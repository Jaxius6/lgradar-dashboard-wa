'use client';

import { useSubscription } from '@/hooks/use-subscription';
import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Lock, LogOut, User } from 'lucide-react';
import { getStripe, PRICING_PLANS } from '@/lib/stripe';
import { useState } from 'react';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  // Bypass subscription check - always allow access
  return <>{children}</>;
}