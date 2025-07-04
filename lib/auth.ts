import { createServerComponentClient } from './supabase';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  organisation_id?: string;
  role?: 'viewer' | 'editor' | 'admin';
}

export async function getServerSession(): Promise<AuthUser | null> {
  const supabase = createServerComponentClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Get user profile with organisation info
    const { data: profile } = await supabase
      .from('profiles')
      .select('organisation_id, role')
      .eq('id', user.id)
      .single();

    return {
      ...user,
      organisation_id: profile?.organisation_id,
      role: profile?.role || 'viewer',
    } as AuthUser;
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getServerSession();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

export async function requireRole(allowedRoles: string[]): Promise<AuthUser> {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role || 'viewer')) {
    redirect('/gazettes');
  }
  
  return user;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatUserName(user: AuthUser): string {
  if (user.user_metadata?.full_name) {
    return user.user_metadata.full_name;
  }
  
  if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
    return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
  }
  
  return user.email?.split('@')[0] || 'User';
}