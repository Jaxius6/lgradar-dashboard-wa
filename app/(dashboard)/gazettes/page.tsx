export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { GazettesTable } from '@/components/gazettes/gazettes-table';
import { GazettesHeader } from '@/components/gazettes/gazettes-header';
import { Card, CardContent } from '@/components/ui/card';

export default function GazettesPage() {
  return (
    <div className="space-y-6">
      <GazettesHeader />
      
      <Card>
        <CardContent className="p-0">
          <Suspense fallback={<GazettesTableSkeleton />}>
            <GazettesTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function GazettesTableSkeleton() {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        
        {/* Table skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 flex-1 bg-muted animate-pulse rounded" />
              <div className="h-6 w-16 bg-muted animate-pulse rounded" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}