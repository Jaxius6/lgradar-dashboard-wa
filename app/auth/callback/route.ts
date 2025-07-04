import { createRouteHandlerClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createRouteHandlerClient(request);
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('OAuth callback error:', error);
        return NextResponse.redirect(`${origin}/login?error=oauth_error`);
      }
    } catch (error) {
      console.error('OAuth exchange error:', error);
      return NextResponse.redirect(`${origin}/login?error=oauth_error`);
    }
  }

  // Redirect to the dashboard after successful authentication
  return NextResponse.redirect(`${origin}/gazettes`);
}