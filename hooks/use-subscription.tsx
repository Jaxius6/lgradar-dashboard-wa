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
    // TEMPORARILY BYPASSED: Provide mock subscription data for demonstration
    const mockSubscription: Subscription = {
      id: 'demo-subscription-id',
      plan: 'yearly',
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
    };

    // Set mock subscription and mark loading as complete
    setSubscription(mockSubscription);
    setLoading(false);
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