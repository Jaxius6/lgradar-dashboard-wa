import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  console.log('🔔 Webhook received at:', new Date().toISOString());
  
  try {
    // Check if Stripe is configured
    if (!stripe) {
      console.error('❌ Stripe not configured - missing environment variables');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    if (!webhookSecret) {
      console.error('❌ Webhook secret not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 });
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    console.log('📝 Webhook details:', {
      bodyLength: body.length,
      hasSignature: !!signature,
      webhookSecretConfigured: !!webhookSecret
    });

    if (!signature) {
      console.error('❌ Missing Stripe signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook signature verified, event type:', event.type);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Create service role client to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('🛒 Processing checkout.session.completed');
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;

        console.log('📋 Session details:', {
          sessionId: session.id,
          userId,
          plan,
          customerId: session.customer,
          subscriptionId: session.subscription,
          hasMetadata: !!session.metadata
        });

        if (userId && plan && session.subscription) {
          try {
            console.log('🔄 Retrieving subscription from Stripe...');
            // Get the actual subscription from Stripe to get accurate dates
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            
            console.log('📊 Subscription retrieved:', {
              id: subscription.id,
              status: subscription.status,
              customerId: subscription.customer
            });
            
            // Update user subscription status in Supabase
            const subscriptionData = {
              user_id: userId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              plan: plan,
              status: subscription.status,
              current_period_start: new Date((subscription as any).current_period_start * 1000),
              current_period_end: new Date((subscription as any).current_period_end * 1000),
              updated_at: new Date().toISOString(),
            };
            
            console.log('💾 Upserting to Supabase:', subscriptionData);
            
            const { error } = await supabase
              .from('subscriptions')
              .upsert(subscriptionData);

            if (error) {
              console.error('❌ Error updating subscription in Supabase:', error);
            } else {
              console.log('✅ Successfully updated subscription in Supabase');
            }
          } catch (stripeError) {
            console.error('❌ Error retrieving subscription from Stripe:', stripeError);
          }
        } else {
          console.log('⚠️ Missing required data:', { userId, plan, subscriptionId: session.subscription });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription status
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date((subscription as any).current_period_start * 1000),
            current_period_end: new Date((subscription as any).current_period_end * 1000),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Error updating subscription status:', error);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Mark subscription as cancelled
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Error cancelling subscription:', error);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}