import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      console.error('Stripe not configured - missing environment variables');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 });
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;

        if (userId && plan && session.subscription) {
          try {
            // Get the actual subscription from Stripe to get accurate dates
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            
            // Update user subscription status in Supabase
            const { error } = await supabase
              .from('subscriptions')
              .upsert({
                user_id: userId,
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: session.subscription as string,
                plan: plan,
                status: subscription.status,
                current_period_start: new Date((subscription as any).current_period_start * 1000),
                current_period_end: new Date((subscription as any).current_period_end * 1000),
                updated_at: new Date().toISOString(),
              });

            if (error) {
              console.error('Error updating subscription:', error);
            }
          } catch (stripeError) {
            console.error('Error retrieving subscription from Stripe:', stripeError);
          }
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