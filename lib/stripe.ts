import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Check if Stripe is properly configured
const isStripeConfigured = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return secretKey && secretKey.startsWith('sk_');
};

// Server-side Stripe instance - only create if properly configured
export const stripe = isStripeConfigured()
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
    })
  : null;

// Client-side Stripe instance
export const getStripe = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    console.warn('Stripe publishable key not found');
    return null;
  }
  return loadStripe(publishableKey);
};

// Product configurations
export const PRICING_PLANS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_297',
    price: 297,
    interval: 'month' as const,
    name: 'Monthly Plan',
    description: 'Billed monthly'
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly_2970',
    price: 2970, // $297 * 10 (2 months free)
    interval: 'year' as const,
    name: 'Yearly Plan',
    description: 'Billed yearly (2 months free)'
  }
};

export type PricingPlan = keyof typeof PRICING_PLANS;