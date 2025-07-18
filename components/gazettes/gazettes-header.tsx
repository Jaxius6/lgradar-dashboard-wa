'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, RefreshCw, X } from 'lucide-react';
import { getGazetteStats, GazetteStats } from '@/lib/actions/gazettes';

interface GazettesHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh?: () => void;
}

export function GazettesHeader({ searchQuery, onSearchChange, onRefresh }: GazettesHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<GazetteStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setStatsLoading(true);
      const { data } = await getGazetteStats();
      setStats(data);
      setStatsLoading(false);
    }
    
    fetchStats();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Refresh stats
    const { data } = await getGazetteStats();
    setStats(data);
    
    // Call parent refresh if provided
    if (onRefresh) {
      await onRefresh();
    }
    
    setIsRefreshing(false);
  };

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Exporting gazettes...');
  };

  return (
    <div className="space-y-6">
      {/* Page title and actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-1 hidden lg:block">
          <h1 className="text-4xl font-bold tracking-tight">Gazettes</h1>
          <p className="text-muted-foreground text-sm">
            Track legislative changes and never miss a critical deadline
          </p>
        </div>
        
        {/* Mobile: Compact single row layout */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gazettes"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10 h-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => onSearchChange('')}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          
          {/* Action buttons - icon only */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 w-9 flex-shrink-0"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleExport}
            className="h-9 w-9 flex-shrink-0"
            title="Export"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Desktop: Original layout */}
        <div className="hidden lg:flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gazettes"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => onSearchChange('')}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}