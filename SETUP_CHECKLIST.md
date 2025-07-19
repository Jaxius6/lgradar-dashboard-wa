# 🚀 Stripe Subscription Setup Checklist

Complete these steps in order to get your Stripe subscriptions working:

## ✅ Step 1: Update Environment Variables

Edit your `.env.local` file and replace these placeholders with your actual values:

### From Stripe Dashboard → Developers → API Keys:
- [ ] Replace `pk_test_your_stripe_publishable_key_here` with your **Publishable key**
- [ ] Replace `sk_test_your_stripe_secret_key_here` with your **Secret key**

### From Stripe Dashboard → Products:
- [ ] Replace `price_your_monthly_price_id_here` with your **Monthly subscription Price ID**
- [ ] Replace `price_your_yearly_price_id_here` with your **Yearly subscription Price ID**

## ✅ Step 2: Set Up Supabase Database

1. [ ] Go to your Supabase Dashboard
2. [ ] Navigate to **SQL Editor**
3. [ ] Copy and paste the contents of `setup_subscription_table.sql`
4. [ ] Run the SQL script
5. [ ] Verify the `user_subscriptions` table was created in the **Table Editor**

## ✅ Step 3: Configure Stripe Webhooks

1. [ ] Go to Stripe Dashboard → **Developers** → **Webhooks**
2. [ ] Click **"Add endpoint"**
3. [ ] Set endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
4. [ ] Select these events:
   - [ ] `checkout.session.completed`
   - [ ] `customer.subscription.updated`
   - [ ] `customer.subscription.deleted`
5. [ ] Copy the **Signing secret** (starts with `whsec_`)
6. [ ] Add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

## ✅ Step 4: Enable Authentication (Remove Testing Mode)

Edit these files to enable real authentication:

### In `components/auth/auth-guard.tsx`:
- [ ] Remove or comment out lines 14-16:
```typescript
// TEMPORARY: Disable authentication for testing
console.log('AuthGuard: Authentication disabled for testing - allowing access');
return <>{children}</>;
```

### In `app/api/stripe/checkout/route.ts`:
- [ ] Remove the test mode logic (lines 21-30) and use real authentication

## ✅ Step 5: Test the Integration

1. [ ] Restart your development server: `npm run dev`
2. [ ] Visit your app and try to access the dashboard
3. [ ] You should see the subscription required page
4. [ ] Click on a subscription plan
5. [ ] Complete the Stripe checkout with test card: `4242 4242 4242 4242`
6. [ ] Verify you can access the dashboard after subscribing

## 🔧 Troubleshooting

### If you get "No such price" error:
- Double-check your Price IDs in `.env.local`
- Make sure they start with `price_`
- Verify they exist in your Stripe Dashboard

### If webhooks aren't working:
- Check the webhook endpoint URL is correct
- Verify the webhook secret in `.env.local`
- Check webhook delivery logs in Stripe Dashboard

### If authentication issues:
- Make sure your Supabase keys are correct
- Check that users can sign up/login properly
- Verify RLS policies are set up correctly

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Check your server logs
3. Check Stripe Dashboard logs
4. Verify all environment variables are set correctly

---

**Once you complete all these steps, your Stripe subscription system will be fully functional!**