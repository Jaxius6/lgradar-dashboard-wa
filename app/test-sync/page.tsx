'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestSyncPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/stripe/sync-subscriptions');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to sync', details: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>🔄 Test Subscription Sync</CardTitle>
          <CardDescription>
            This will sync your Stripe subscription to the Supabase database using the service role key.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleSync} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Syncing...' : 'Sync Subscriptions'}
          </Button>
          
          {result && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}