'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase-client';
import { useUser } from './use-user';

interface Subscription {
  id: string;
  plan: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'past_due' | 'incomplete';
  current_period_start: string;
  current_period_end: string;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  hasActiveSubscription: boolean;
  loading: boolean;
  refetch: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasTemporaryAccess, setHasTemporaryAccess] = useState(false);
  const { user } = useUser();
  const supabase = createClientComponentClient();

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Check for temporary access (user just completed payment)
      const tempAccess = sessionStorage.getItem('stripe_payment_success');
      if (tempAccess) {
        const accessData = JSON.parse(tempAccess);
        const accessTime = new Date(accessData.timestamp);
        const now = new Date();
        const timeDiff = now.getTime() - accessTime.getTime();
        
        // Grant temporary access for 10 minutes after payment
        if (timeDiff < 10 * 60 * 1000) {
          setHasTemporaryAccess(true);
          setSubscription({
            id: 'temp-access',
            plan: accessData.plan || 'monthly',
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
          setLoading(false);
          return;
        } else {
          // Remove expired temporary access
          sessionStorage.removeItem('stripe_payment_success');
          setHasTemporaryAccess(false);
        }
      }
      
      // First try the 'subscriptions' table
      let { data, error } = await supabase
        .from('subscriptions')
        .select('id, plan, status, current_period_start, current_period_end')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing', 'past_due'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // If no data found in 'subscriptions', try 'user_subscriptions' table
      if (error?.code === 'PGRST116' || !data) {
        console.log('No data in subscriptions table, trying user_subscriptions...');
        const { data: userData, error: userError } = await supabase
          .from('user_subscriptions')
          .select('id, plan, status, current_period_start, current_period_end')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing', 'past_due'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        data = userData;
        error = userError;
        
        if (userData) {
          console.log('Found subscription in user_subscriptions table:', userData);
        }
      } else if (data) {
        console.log('Found subscription in subscriptions table:', data);
      }

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - user has no active subscription
          setSubscription(null);
        } else {
          console.error('Error fetching subscription:', error);
          setSubscription(null);
        }
      } else if (data) {
        setSubscription(data);
        // Clear temporary access if real subscription found
        if (hasTemporaryAccess) {
          sessionStorage.removeItem('stripe_payment_success');
          setHasTemporaryAccess(false);
        }
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const hasActiveSubscription = (subscription &&
    ['active', 'trialing', 'past_due'].includes(subscription.status) &&
    (subscription.current_period_end === null || new Date(subscription.current_period_end) > new Date())) || hasTemporaryAccess;

  const refetch = () => {
    fetchSubscription();
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      hasActiveSubscription,
      loading,
      refetch
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}