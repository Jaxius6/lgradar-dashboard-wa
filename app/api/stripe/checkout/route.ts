import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICING_PLANS, PricingPlan } from '@/lib/stripe';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      console.error('Stripe not configured - missing environment variables');
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { plan }: { plan: PricingPlan } = body;
    
    if (!plan || !PRICING_PLANS[plan]) {
      return NextResponse.json({ error: 'Invalid subscription plan' }, { status: 400 });
    }

    // Get user from Supabase
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const selectedPlan = PRICING_PLANS[plan];

    // Validate price ID exists
    if (!selectedPlan.priceId) {
      console.error(`Missing price ID for plan: ${plan}`);
      return NextResponse.json({ error: 'Plan configuration error' }, { status: 500 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.nextUrl.origin}/settings?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/settings?canceled=true`,
      metadata: {
        user_id: user.id,
        plan: plan,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return NextResponse.json({ error: 'Payment failed' }, { status: 400 });
    } else if (error.type === 'StripeRateLimitError') {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    } else if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    } else if (error.type === 'StripeAPIError') {
      return NextResponse.json({ error: 'Payment system error' }, { status: 502 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}