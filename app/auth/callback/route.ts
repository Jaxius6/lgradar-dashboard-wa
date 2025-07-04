import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  
  // Get the redirect destination (default to gazettes)
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/gazettes';

  if (code) {
    // Create response object first
    const response = NextResponse.redirect(`${origin}${redirectTo}`);
    
    // Create Supabase client with proper cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
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
      }
    );
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('OAuth callback error:', error);
        return NextResponse.redirect(`${origin}/login?error=oauth_error`);
      }

      // Verify the session was created successfully
      if (!data.session) {
        console.error('No session created after OAuth exchange');
        return NextResponse.redirect(`${origin}/login?error=session_error`);
      }

      console.log('OAuth session created successfully for user:', data.session.user.email);
      
      // Return the response with cookies properly set
      return response;
    } catch (error) {
      console.error('OAuth exchange error:', error);
      return NextResponse.redirect(`${origin}/login?error=oauth_error`);
    }
  }

  // If no code, redirect to login
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}