'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize Supabase client only on the client side
    if (typeof window !== 'undefined') {
      const client = createClientComponentClient();
      if (!client) {
        setLoading(false);
        return;
      }
      setSupabase(client);

      const getUser = async () => {
        try {
          // First try to get the session
          const { data: { session } } = await client.auth.getSession();
          
          if (session?.user) {
            setUser(session.user);
            setLoading(false);
            return;
          }

          // If no session, try to get user directly
          const { data: { user } } = await client.auth.getUser();
          setUser(user);
          setLoading(false);

          if (!user) {
            router.push('/login');
          }
        } catch (error) {
          console.error('Error getting user in AuthGuard:', error);
          setLoading(false);
          router.push('/login');
        }
      };

      getUser();

      const { data: { subscription } } = client.auth.onAuthStateChange(
        (event: string, session: any) => {
          console.log('Auth state change:', event, !!session);
          if (event === 'SIGNED_OUT' || !session) {
            setUser(null);
            router.push('/login');
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            setUser(session.user);
          }
        }
      );

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      )
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}