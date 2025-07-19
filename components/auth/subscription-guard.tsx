'use client';

import { useSubscription } from '@/hooks/use-subscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Lock } from 'lucide-react';
import { getStripe, PRICING_PLANS } from '@/lib/stripe';
import { useState } from 'react';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { hasActiveSubscription, loading, subscription } = useSubscription();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    try {
      setCheckoutLoading(plan);
      
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const { sessionId } = await response.json();
      
      const stripe = await getStripe();
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasActiveSubscription) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Lock className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Subscription Required</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access to LG Radar requires an active subscription. Choose a plan below to continue.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          <Card className="relative">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-xl">Monthly</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">${PRICING_PLANS.monthly.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <CardDescription className="mt-2">
                Perfect for getting started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {[
                  'Unlimited gazette access',
                  'Real-time notifications',
                  'Advanced search & filters',
                  'Export capabilities',
                  'Email support'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe('monthly')}
                disabled={checkoutLoading === 'monthly'}
              >
                {checkoutLoading === 'monthly' ? 'Processing...' : 'Start Monthly Plan'}
              </Button>
            </CardContent>
          </Card>

          {/* Yearly Plan */}
          <Card className="relative border-primary">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
            </div>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-xl">Yearly</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">${Math.round(PRICING_PLANS.yearly.price / 12)}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Billed annually (${PRICING_PLANS.yearly.price})
              </div>
              <CardDescription className="mt-2">
                Save 2 months with yearly billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {[
                  'Everything in Monthly',
                  'Priority support',
                  'Advanced analytics',
                  'Team collaboration (up to 5 users)',
                  'Custom integrations',
                  '2 months free'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe('yearly')}
                disabled={checkoutLoading === 'yearly'}
              >
                {checkoutLoading === 'yearly' ? 'Processing...' : 'Start Yearly Plan'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust indicators */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Secure payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>14-day guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}