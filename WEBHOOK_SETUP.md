# Stripe Webhook Setup Instructions

## 1. Create Webhook Endpoint in Stripe

1. Go to your Stripe Dashboard
2. Navigate to **Developers** → **Webhooks**
3. Click **"Add endpoint"**
4. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
   - For local testing: `http://localhost:3000/api/stripe/webhook`
   - For production: `https://your-actual-domain.com/api/stripe/webhook`

## 2. Select Events to Listen For

Add these specific events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## 3. Get Webhook Secret

1. After creating the webhook, click on it
2. In the **Signing secret** section, click **"Reveal"**
3. Copy the webhook secret (starts with `whsec_`)
4. Add it to your `.env.local` file as `STRIPE_WEBHOOK_SECRET`

## 4. For Local Testing (Optional)

If you want to test webhooks locally, install Stripe CLI:

```bash
# Install Stripe CLI
# Then run this to forward webhooks to your local server:
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will give you a temporary webhook secret for testing.