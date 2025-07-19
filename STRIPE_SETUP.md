# Stripe Integration Setup Guide

This guide will help you set up Stripe payments and subscriptions for the LG Radar dashboard.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Supabase project with the user_subscriptions table created
3. Environment variables configured

## Step 1: Create Stripe Products and Prices

1. Log into your Stripe Dashboard
2. Go to Products → Create Product
3. Create two products:

### Monthly Plan
- Name: "LG Radar Monthly"
- Description: "Monthly subscription to LG Radar"
- Pricing: $297 AUD per month
- Billing period: Monthly
- Copy the Price ID (starts with `price_`)

### Yearly Plan
- Name: "LG Radar Yearly"
- Description: "Yearly subscription to LG Radar (2 months free)"
- Pricing: $2970 AUD per year
- Billing period: Yearly
- Copy the Price ID (starts with `price_`)

## Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id_here
STRIPE_YEARLY_PRICE_ID=price_your_yearly_price_id_here
```

## Step 3: Set Up Webhooks

1. In Stripe Dashboard, go to Developers → Webhooks
2. Click "Add endpoint"
3. Set endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret (starts with `whsec_`)

## Step 4: Configure Customer Portal

1. In Stripe Dashboard, go to Settings → Billing → Customer portal
2. Enable the customer portal
3. Configure allowed features:
   - Update payment method
   - Download invoices
   - Cancel subscription
   - Update billing information

## Step 5: Test the Integration

### Test Subscription Flow
1. Start your development server
2. Log into the dashboard
3. Go to Settings → Billing
4. Click on "Monthly Plan" or "Yearly Plan"
5. Use Stripe test card: `4242 4242 4242 4242`
6. Complete the checkout process
7. Verify subscription appears in Settings

### Test Webhook
1. Use Stripe CLI to forward webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. Complete a test subscription
3. Check your application logs for webhook events

## Step 6: Production Setup

1. Replace test keys with live keys in production environment
2. Update webhook endpoint to production URL
3. Test with real payment methods
4. Monitor webhook delivery in Stripe Dashboard

## Troubleshooting

### Common Issues

1. **"Stripe not configured" error**
   - Check that all environment variables are set
   - Ensure keys start with correct prefixes (pk_, sk_, whsec_, price_)

2. **Webhook signature verification failed**
   - Verify webhook secret is correct
   - Check that webhook URL is accessible
   - Ensure raw body is passed to webhook verification

3. **"No active subscription found"**
   - Check that webhook events are being processed
   - Verify user_subscriptions table has correct data
   - Check Supabase RLS policies allow access

4. **Price ID not found**
   - Verify price IDs in environment variables
   - Check that products are active in Stripe Dashboard

### Debugging

Enable debug logging by adding to your webhook handler:
```javascript
console.log('Webhook event:', event.type);
console.log('Event data:', event.data.object);
```

## Security Considerations

1. Never expose secret keys in client-side code
2. Always verify webhook signatures
3. Use HTTPS in production
4. Implement proper error handling
5. Log security events for monitoring

## Support

For Stripe-specific issues, consult:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For application-specific issues, check the application logs and Supabase dashboard.