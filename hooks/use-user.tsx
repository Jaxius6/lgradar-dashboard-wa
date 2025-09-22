'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';

interface UserContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    // TEMPORARILY BYPASSED: Provide mock user data for demonstration
    const mockUser: User = {
      id: 'demo-user-id',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'demo@lgsharp.com',
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {
        full_name: 'Demo User'
      },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Set mock user and mark loading as complete
    setUser(mockUser);
    setLoading(false);

    // Initialize Supabase client for potential future use
    if (typeof window !== 'undefined') {
      const client = createClientComponentClient();
      setSupabase(client);
    }
  }, []);

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}