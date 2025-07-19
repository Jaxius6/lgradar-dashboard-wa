# 🔧 Webhook Debugging Guide

Your Supabase table is empty because the webhook isn't working. Here's how to debug:

## 🔍 Step 1: Check Stripe Webhook Logs

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. Check the **Logs** tab

**Look for:**
- ✅ **200 responses** = Working
- ❌ **4xx/5xx errors** = Failing
- ⚠️ **No attempts** = Not configured correctly

## 🌐 Step 2: Test Webhook Endpoint

Visit: `https://your-vercel-domain.vercel.app/api/stripe/webhook-test`

**Expected response:**
```json
{
  "message": "Webhook endpoint is reachable",
  "timestamp": "2025-01-19T07:28:00.000Z",
  "environment": "production"
}
```

## 🔧 Step 3: Common Issues & Fixes

### Issue 1: Webhook URL Wrong
**Problem:** Webhook pointing to wrong URL
**Fix:** Update webhook URL to: `https://your-vercel-domain.vercel.app/api/stripe/webhook`

### Issue 2: Webhook Secret Mismatch
**Problem:** `STRIPE_WEBHOOK_SECRET` doesn't match Stripe
**Fix:** 
1. Go to Stripe webhook → **Signing secret** → **Reveal**
2. Copy the secret (starts with `whsec_`)
3. Update in Vercel environment variables

### Issue 3: Missing Events
**Problem:** Webhook not listening to correct events
**Fix:** Ensure these events are selected:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`

### Issue 4: Environment Variables Not Deployed
**Problem:** Local `.env.local` not synced to Vercel
**Fix:**
1. Go to Vercel dashboard → Your project → **Settings** → **Environment Variables**
2. Ensure these are set:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 🧪 Step 4: Manual Test

1. **Make a test purchase** in your app
2. **Check Vercel logs** immediately after:
   - Go to Vercel dashboard → Your project → **Functions** → **View Function Logs**
   - Look for webhook logs with 🔔 emoji

3. **Check Stripe webhook logs**:
   - Should show delivery attempt
   - Should show 200 response

## 🔍 Step 5: Debug Logs

After making a purchase, you should see these logs in Vercel:

```
🔔 Webhook received at: 2025-01-19T07:28:00.000Z
📝 Webhook details: { bodyLength: 1234, hasSignature: true, webhookSecretConfigured: true }
✅ Webhook signature verified, event type: checkout.session.completed
🛒 Processing checkout.session.completed
📋 Session details: { sessionId: "cs_...", userId: "...", plan: "monthly" }
🔄 Retrieving subscription from Stripe...
📊 Subscription retrieved: { id: "sub_...", status: "active" }
💾 Upserting to Supabase: { user_id: "...", plan: "monthly" }
✅ Successfully updated subscription in Supabase
```

## 🚨 If Still Not Working

### Option 1: Manual Sync (Temporary Fix)
Create a manual sync endpoint to populate Supabase from Stripe:

```
GET /api/stripe/sync-subscriptions
```

### Option 2: Direct Stripe Integration
Skip Supabase table and query Stripe directly (slower but reliable)

### Option 3: Webhook Retry
Use Stripe CLI to replay webhook events:

```bash
stripe events resend evt_your_event_id
```

## 📞 Next Steps

1. **Check Stripe webhook logs first** - this will tell you if webhooks are being sent
2. **Check Vercel function logs** - this will tell you if webhooks are being received
3. **Test the webhook-test endpoint** - this will verify your deployment is working

Let me know what you find in the Stripe webhook logs!