'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { getStripe, PRICING_PLANS } from '@/lib/stripe';

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    try {
      setLoading(plan);
      
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      const stripe = await getStripe();
      if (stripe && sessionId) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get unlimited access to WA legislative tracking. Never miss a Gazette again.
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
              disabled={loading === 'monthly'}
            >
              {loading === 'monthly' ? (
                'Redirecting to Stripe...'
              ) : (
                <>
                  Start Monthly Plan
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
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
              disabled={loading === 'yearly'}
            >
              {loading === 'yearly' ? (
                'Redirecting to Stripe...'
              ) : (
                <>
                  Start Yearly Plan
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Why Choose LG Radar?</CardTitle>
          <CardDescription>
            Comprehensive legislative tracking for WA councils
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <Calendar className="h-8 w-8 mx-auto text-primary" />
              <h3 className="font-medium">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">
                Get notified the moment new gazettes are published
              </p>
            </div>
            <div className="text-center space-y-2">
              <CreditCard className="h-8 w-8 mx-auto text-primary" />
              <h3 className="font-medium">Secure & Reliable</h3>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade security with 99.9% uptime
              </p>
            </div>
            <div className="text-center space-y-2">
              <DollarSign className="h-8 w-8 mx-auto text-primary" />
              <h3 className="font-medium">Great Value</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive tracking at an affordable price
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust indicators */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Secure payments via Stripe</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>14-day money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}