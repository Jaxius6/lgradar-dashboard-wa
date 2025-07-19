# 🎯 Get Price IDs and Set Up Webhook

## Step 1: Get Price IDs from Stripe Dashboard

You gave me **Product IDs**, but we need **Price IDs**. Here's how to get them:

### For Monthly Subscription:
1. Go to your Stripe Dashboard → **Products**
2. Click on your **Monthly subscription product** (prod_ShYQkqKQRYF5mM)
3. In the product details, you'll see a **Pricing** section
4. Copy the **Price ID** (starts with `price_`, not `prod_`)
5. This is your `STRIPE_MONTHLY_PRICE_ID`

### For Yearly Subscription:
1. Click on your **Yearly subscription product** (prod_ShYii8ARaFmMVx)
2. In the product details, look for the **Pricing** section
3. Copy the **Price ID** (starts with `price_`, not `prod_`)
4. This is your `STRIPE_YEARLY_PRICE_ID`

## Step 2: Set Up Webhook and Get Secret

### Create Webhook:
1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Set endpoint URL to: `https://your-vercel-domain.vercel.app/api/stripe/webhook`
   - Replace `your-vercel-domain` with your actual Vercel domain
4. Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Click **"Add endpoint"**

### Get Webhook Secret:
1. After creating the webhook, click on it
2. In the **Signing secret** section, click **"Reveal"**
3. Copy the webhook secret (starts with `whsec_`)
4. This is your `STRIPE_WEBHOOK_SECRET`

## Step 3: Update Your Environment Variables

Once you have the Price IDs and webhook secret, update your `.env.local`:

```env
# Replace these with your actual Price IDs:
STRIPE_MONTHLY_PRICE_ID=price_your_actual_monthly_price_id
STRIPE_YEARLY_PRICE_ID=price_your_actual_yearly_price_id

# Replace with your webhook secret:
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
```

## Step 4: Deploy to Vercel

Make sure to add these same environment variables to your Vercel deployment:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all the Stripe environment variables

## 🔍 How to Verify You Have the Right IDs

**Product ID** (what you gave me):
- ❌ `prod_ShYQkqKQRYF5mM` - This is a Product ID
- ❌ `prod_ShYii8ARaFmMVx` - This is a Product ID

**Price ID** (what we need):
- ✅ `price_1ABC123def456GHI` - This is a Price ID
- ✅ `price_1XYZ789uvw012JKL` - This is a Price ID

The Price IDs are what Stripe uses for actual billing!