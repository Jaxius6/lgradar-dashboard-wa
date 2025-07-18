'use client';

import { createContext, useContext, useEffect, useState } from 'react';
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
      
      // Call the Supabase function to get user subscription
      const { data, error } = await supabase.rpc('get_user_subscription', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error fetching subscription:', error);
        setSubscription(null);
      } else if (data && data.length > 0) {
        setSubscription(data[0]);
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

  const hasActiveSubscription = subscription?.status === 'active' && 
    new Date(subscription.current_period_end) > new Date();

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