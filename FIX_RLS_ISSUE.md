# 🔧 Fix RLS Issue - Service Role Key Required

## 🚨 **The Problem**
Error: `"new row violates row-level security policy for table \"subscriptions\""`

**Root Cause:** Webhooks need the **service role key** to bypass RLS policies and insert subscription data.

## ✅ **The Solution**

### Step 1: Get Your Service Role Key
1. Go to **Supabase Dashboard**
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (starts with `eyJ...`)
4. ⚠️ **IMPORTANT:** This is different from your anon key!

### Step 2: Add to Environment Variables

#### Local (.env.local):
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_service_role_key_here
```

#### Vercel (Production):
1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add: `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_service_role_key_here`

### Step 3: Test the Fix

After adding the service role key:

1. **Redeploy to Vercel** (or restart local dev server)
2. **Test manual sync**: Visit `/api/stripe/sync-subscriptions`
3. **Should now work**: `"Sync completed: 1/1 subscriptions synced"`

## 🎯 **What I Fixed**

1. ✅ **Updated webhook** to use service role client
2. ✅ **Updated sync endpoint** to use service role client  
3. ✅ **Proper RLS bypass** for webhook operations

## 🔍 **Why This Happens**

- **User context**: Limited by RLS policies (can only see own data)
- **Service role**: Bypasses RLS (can insert/update any data)
- **Webhooks**: Need service role because they run without user context

## 🚀 **After Adding Service Role Key**

Your subscription system will be **100% functional**:
- ✅ Webhooks will work automatically
- ✅ Manual sync will work
- ✅ Supabase table will populate
- ✅ Dashboard access will work perfectly

**Add the service role key and try the sync endpoint again!**