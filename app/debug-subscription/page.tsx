'use client';

import { useSubscription } from '@/hooks/use-subscription';
import { useUser } from '@/hooks/use-user';

export default function DebugSubscriptionPage() {
  const { user } = useUser();
  const { subscription, hasActiveSubscription, loading } = useSubscription();

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">🔍 Debug Subscription State</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">User:</h3>
          <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Subscription Loading:</h3>
          <pre className="text-sm">{loading.toString()}</pre>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Has Active Subscription:</h3>
          <pre className="text-sm">{hasActiveSubscription.toString()}</pre>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Subscription Data:</h3>
          <pre className="text-sm">{JSON.stringify(subscription, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}