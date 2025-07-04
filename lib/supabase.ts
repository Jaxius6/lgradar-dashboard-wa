import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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

// Server-side Supabase client for Server Components
export const createServerComponentClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time, return a mock client to prevent errors
    return null as any;
  }
  
  const cookieStore = cookies();
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });
};

// Server-side Supabase client for Route Handlers
export const createRouteHandlerClient = (request: NextRequest, response?: NextResponse) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        if (response) {
          response.cookies.set({ name, value, ...options });
        } else {
          request.cookies.set({ name, value, ...options });
        }
      },
      remove(name: string, options: any) {
        if (response) {
          response.cookies.set({ name, value: '', ...options });
        } else {
          request.cookies.set({ name, value: '', ...options });
        }
      },
    },
  });
};

// Server-side Supabase client for Middleware
export const createMiddlewareClient = (request: NextRequest) => {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Check if environment variables are available
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that won't cause errors
    return {
      supabase: {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          getUser: async () => ({ data: { user: null }, error: null })
        }
      } as any,
      response
    };
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  return { supabase, response };
};

// Admin client for server-side operations
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};