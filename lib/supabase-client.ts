'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client-side Supabase client
export const createClientComponentClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time, return a mock client to prevent errors
    if (typeof window === 'undefined') {
      return null as any;
    }
    throw new Error('Missing Supabase environment variables');
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};