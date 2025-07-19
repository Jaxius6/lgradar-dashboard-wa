import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      console.error('Stripe not configured - missing environment variables');
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 503 });
    }

    const supabase = createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Get the user's subscription to find their Stripe customer ID
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError) {
      if (subError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'No subscription found. Please subscribe first.' },
          { status: 404 }
        );
      }
      console.error('Database error:', subError);
      return NextResponse.json(
        { error: 'Failed to retrieve subscription' },
        { status: 500 }
      );
    }

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No customer ID found. Please contact support.' },
        { status: 404 }
      );
    }

    // Verify the customer exists in Stripe
    try {
      await stripe.customers.retrieve(subscription.stripe_customer_id);
    } catch (stripeError: any) {
      console.error('Stripe customer error:', stripeError);
      return NextResponse.json(
        { error: 'Customer not found in payment system' },
        { status: 404 }
      );
    }

    // Create a customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${request.nextUrl.origin}/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({ error: 'Invalid customer' }, { status: 400 });
    } else if (error.type === 'StripeAPIError') {
      return NextResponse.json({ error: 'Payment system error' }, { status: 502 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}