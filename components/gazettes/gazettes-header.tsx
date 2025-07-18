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
    <div className="space-y-4">
      {/* Page title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gazettes</h1>
          <p className="text-muted-foreground">
            Track legislative changes and never miss a critical deadline
          </p>
        </div>
        
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

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Gazettes</p>
                {statsLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.total || 0}</p>
                )}
              </div>
              <Badge variant="secondary">Live</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                {statsLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-bold text-red-400">{stats?.highRisk || 0}</p>
                )}
              </div>
              <Badge variant="destructive">Urgent</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                {statsLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-bold text-yellow-400">{stats?.expiringSoon || 0}</p>
                )}
              </div>
              <Badge variant="outline">7 days</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Relevant</p>
                {statsLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-bold text-green-400">{stats?.relevant || 0}</p>
                )}
              </div>
              <Badge variant="default">Flagged</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gazettes by title, jurisdiction, or category..."
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
            <Button variant="outline" size="default">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}