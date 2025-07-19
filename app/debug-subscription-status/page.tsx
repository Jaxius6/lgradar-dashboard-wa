'use client';

import { useSubscription } from '@/hooks/use-subscription';
import { useUser } from '@/hooks/use-user';
import { UserProvider } from '@/hooks/use-user';
import { SubscriptionProvider } from '@/hooks/use-subscription';
import { createClientComponentClient } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';

function DebugContent() {
  const { user } = useUser();
  const { subscription, hasActiveSubscription, loading } = useSubscription();
  const [rawSubscriptionData, setRawSubscriptionData] = useState<any>(null);
  const [queryError, setQueryError] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchRawData = async () => {
      if (!user) return;
      
      try {
        // Query without filters to see all data
        const { data: allSubs, error: allError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id);
          
        console.log('All subscriptions for user:', allSubs);
        console.log('Query error:', allError);
        
        setRawSubscriptionData(allSubs);
        setQueryError(allError);
      } catch (error) {
        console.error('Raw query error:', error);
        setQueryError(error);
      }
    };

    fetchRawData();
  }, [user]);

  if (!user) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">🔍 Debug Subscription Status</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">User Info:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify({
            id: user.id,
            email: user.email,
            created_at: user.created_at
          }, null, 2)}</pre>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Hook State:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify({
            loading,
            hasActiveSubscription,
            subscription
          }, null, 2)}</pre>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Raw Subscription Data (All Records):</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(rawSubscriptionData, null, 2)}</pre>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Query Error:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(queryError, null, 2)}</pre>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Current Date:</h3>
          <pre className="text-sm">{new Date().toISOString()}</pre>
        </div>
      </div>
    </div>
  );
}

export default function DebugSubscriptionStatus() {
  return (
    <UserProvider>
      <SubscriptionProvider>
        <DebugContent />
      </SubscriptionProvider>
    </UserProvider>
  );
}