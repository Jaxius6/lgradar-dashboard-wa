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
  // TEMPORARILY BYPASSED: Allow access without authentication
  console.log('AuthGuard: Bypassing authentication - allowing full access');
  
  // Render children immediately without any authentication checks
  return <>{children}</>;
}