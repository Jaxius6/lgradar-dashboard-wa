import { createMiddlewareClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // Check if Supabase environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      // If environment variables are not available, allow the request to proceed
      return NextResponse.next();
    }

    const { supabase, response } = createMiddlewareClient(request);

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protected routes that require authentication
    const protectedPaths = ['/gazettes', '/alerts', '/logs', '/billing', '/contact', '/settings'];
    const authPaths = ['/login', '/signup'];
    
    const isProtectedPath = protectedPaths.some(path =>
      request.nextUrl.pathname.startsWith(path)
    );
    
    const isAuthPath = authPaths.some(path =>
      request.nextUrl.pathname.startsWith(path)
    );

    // Redirect to login if accessing protected route without authentication
    if (isProtectedPath && !user) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
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