import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Force dynamic rendering since we use cookies()
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    // Create server client for auth with cookies
    const cookieStore = cookies();
    const authSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    );
    
    // Create service role client for database operations
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get() { return undefined },
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Get the authenticated user from session
    const { data: { session }, error: authError } = await authSupabase.auth.getSession();
    
    if (authError || !session?.user) {
      console.log('🚫 Auth failed:', authError?.message || 'No session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;

    console.log('🔄 Manual sync started for user:', user.id);

    // Get all subscriptions from Stripe for this user's email
    const subscriptions = await stripe.subscriptions.list({
      limit: 100,
    });

    console.log('📊 Found', subscriptions.data.length, 'total subscriptions in Stripe');

    // Filter subscriptions for this user's email
    const userSubscriptions = [];
    
    for (const subscription of subscriptions.data) {
      try {
        // Get customer details to match email
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (customer && !customer.deleted && (customer as any).email === user.email) {
          userSubscriptions.push({
            subscription,
            customer
          });
        }
      } catch (error) {
        console.log('⚠️ Error retrieving customer:', error);
      }
    }

    console.log('👤 Found', userSubscriptions.length, 'subscriptions for user email:', user.email);

    if (userSubscriptions.length === 0) {
      return NextResponse.json({ 
        message: 'No subscriptions found for this user',
        userEmail: user.email,
        totalStripeSubscriptions: subscriptions.data.length
      });
    }

    // Sync each subscription to Supabase
    const syncResults = [];
    
    for (const { subscription, customer } of userSubscriptions) {
      try {
        // Determine plan from price ID
        let plan = 'monthly';
        if (subscription.items.data[0]?.price.id === process.env.STRIPE_YEARLY_PRICE_ID) {
          plan = 'yearly';
        }

        const subscriptionData = {
          user_id: user.id,
          stripe_customer_id: subscription.customer as string,
          stripe_subscription_id: subscription.id,
          plan: plan,
          status: subscription.status,
          current_period_start: new Date((subscription as any).current_period_start * 1000),
          current_period_end: new Date((subscription as any).current_period_end * 1000),
          updated_at: new Date().toISOString(),
        };

        console.log('💾 Syncing subscription:', {
          id: subscription.id,
          status: subscription.status,
          plan
        });

        const { error } = await supabase
          .from('subscriptions')
          .upsert(subscriptionData);

        if (error) {
          console.error('❌ Error syncing subscription:', error);
          syncResults.push({ 
            subscriptionId: subscription.id, 
            success: false, 
            error: error.message 
          });
        } else {
          console.log('✅ Successfully synced subscription:', subscription.id);
          syncResults.push({ 
            subscriptionId: subscription.id, 
            success: true 
          });
        }
      } catch (error: any) {
        console.error('❌ Error processing subscription:', error);
        syncResults.push({ 
          subscriptionId: subscription.id, 
          success: false, 
          error: error.message 
        });
      }
    }

    const successCount = syncResults.filter(r => r.success).length;
    
    return NextResponse.json({
      message: `Sync completed: ${successCount}/${syncResults.length} subscriptions synced`,
      userEmail: user.email,
      results: syncResults
    });

  } catch (error: any) {
    console.error('❌ Sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: error.message },
      { status: 500 }
    );
  }
}