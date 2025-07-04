'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client-side Supabase client
export const createClientComponentClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that won't cause errors
    console.warn('Supabase environment variables not found. Authentication features will be disabled.');
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Authentication not configured' } }),
        signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Authentication not configured' } })
      }
    } as any;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};