'use client';

export const dynamic = 'force-dynamic';

import { useState, useCallback } from 'react';
import { GazettesTable } from '@/components/gazettes/gazettes-table';
import { GazettesHeader } from '@/components/gazettes/gazettes-header';
import { Card, CardContent } from '@/components/ui/card';

export default function GazettesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="space-y-6">
      <GazettesHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onRefresh={handleRefresh}
      />
      
      <Card>
        <CardContent className="p-0">
          <GazettesTable
            searchQuery={searchQuery}
            key={refreshKey}
          />
        </CardContent>
      </Card>
    </div>
  );
}
