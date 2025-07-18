'use client';

export const dynamic = 'force-dynamic';

import { useState, useCallback } from 'react';
import { TabledTable } from '@/components/tabled/tabled-table';
import { TabledHeader } from '@/components/tabled/tabled-header';
import { Card, CardContent } from '@/components/ui/card';

export default function TabledPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTypesChange = useCallback((types: string[]) => {
    setSelectedTypes(types);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="space-y-6">
      <TabledHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedTypes={selectedTypes}
        onTypesChange={handleTypesChange}
        onRefresh={handleRefresh}
      />
      
      <Card>
        <CardContent className="p-0">
          <TabledTable
            searchQuery={searchQuery}
            selectedTypes={selectedTypes}
            key={refreshKey}
          />
        </CardContent>
      </Card>
    </div>
  );
}