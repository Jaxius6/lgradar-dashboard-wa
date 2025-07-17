import { createMiddlewareClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // TEMPORARY: Disable authentication for testing
    console.log('Middleware: Authentication disabled for testing - allowing all requests');
    return NextResponse.next();

    // Check if Supabase environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      // If environment variables are not available, allow the request to proceed
      return NextResponse.next();
    }

    const { supabase, response } = createMiddlewareClient(request);

    // Skip middleware for auth callback to prevent redirect loops
    if (request.nextUrl.pathname === '/auth/callback') {
      return NextResponse.next();
    }

    // Refresh session if expired - required for Server Components
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();

    // Protected routes that require authentication
    const protectedPaths = ['/gazettes', '/alerts', '/logs', '/billing', '/contact', '/settings'];
    const authPaths = ['/login', '/signup'];
    
    const isProtectedPath = protectedPaths.some(path =>
      request.nextUrl.pathname.startsWith(path)
    );
    
    const isAuthPath = authPaths.some(path =>
      request.nextUrl.pathname.startsWith(path)
    );

    // For protected paths, check if we have a valid session
    if (isProtectedPath) {
      // If no user but we have a session, try to refresh
      if (!user && session) {
        try {
          const { data: { user: refreshedUser } } = await supabase.auth.getUser();
          if (refreshedUser) {
            return response;
          }
        } catch (error) {
          console.error('Error refreshing user:', error);
        }
      }
      
      // If still no user, redirect to login
      if (!user) {
        console.log('Middleware: Redirecting to login for protected path:', request.nextUrl.pathname);
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Redirect to dashboard if accessing auth pages while authenticated
    if (isAuthPath && user) {
      return NextResponse.redirect(new URL('/gazettes', request.url));
    }

    return response;
  } catch (error) {
    // If middleware fails, log the error and allow the request to proceed
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};