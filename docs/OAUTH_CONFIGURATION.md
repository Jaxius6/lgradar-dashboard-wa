# OAuth Configuration Guide

This guide explains how to properly configure OAuth authentication for the LG Radar Dashboard.

## Google OAuth Setup

### 1. Supabase Dashboard Configuration

The main issue with Google OAuth redirecting to localhost instead of the production domain is that the redirect URLs need to be configured in the Supabase dashboard.

**Steps to fix:**

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Update the **Site URL** to: `https://wa.lgradar.com.au`
4. In **Redirect URLs**, add:
   - `https://wa.lgradar.com.au/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

### 2. Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID
4. In **Authorized redirect URIs**, add:
   - `https://memlxbsitkqvgitjubfo.supabase.co/auth/v1/callback`
   - Make sure the Supabase URL matches your project

### 3. Environment Variables

Ensure your production environment has:

```env
NEXT_PUBLIC_APP_URL=https://wa.lgradar.com.au
NEXTAUTH_URL=https://wa.lgradar.com.au
```

### 4. Vercel Deployment Configuration

If deploying on Vercel, set these environment variables in your Vercel dashboard:

- `NEXT_PUBLIC_APP_URL` = `https://wa.lgradar.com.au`
- `NEXTAUTH_URL` = `https://wa.lgradar.com.au`

## Common Issues

### Issue: OAuth redirects to localhost in production

**Cause:** Supabase Site URL is still set to localhost

**Solution:** Update Supabase Site URL to production domain

### Issue: "Invalid redirect URL" error

**Cause:** Redirect URL not whitelisted in Google Cloud Console

**Solution:** Add the correct Supabase callback URL to Google OAuth configuration

### Issue: OAuth works in development but not production

**Cause:** Environment variables not set correctly in production

**Solution:** Verify all environment variables are set in your deployment platform

## Testing

1. **Development:** OAuth should redirect to `http://localhost:3000/auth/callback`
2. **Production:** OAuth should redirect to `https://wa.lgradar.com.au/auth/callback`

## Debugging

Add this to your login page to debug redirect URLs:

```javascript
console.log('OAuth redirect URL:', redirectUrl);
```

The redirect URL should match your current environment (localhost for dev, production domain for prod).