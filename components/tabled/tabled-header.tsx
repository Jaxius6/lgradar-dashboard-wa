'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, RefreshCw, X, ChevronDown, ChevronUp } from 'lucide-react';
import { getTabledItemTypes } from '@/lib/actions/tabled';

interface TabledHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  onRefresh?: () => void;
}


export function TabledHeader({
  searchQuery,
  onSearchChange,
  selectedTypes,
  onTypesChange,
  onRefresh
}: TabledHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(true); // Default open

  useEffect(() => {
    async function fetchTypes() {
      setTypesLoading(true);
      const { data } = await getTabledItemTypes();
      setAvailableTypes(data as string[]);
      setTypesLoading(false);
    }
    
    fetchTypes();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    if (onRefresh) {
      await onRefresh();
    }
    
    setIsRefreshing(false);
  };

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Exporting tabled items...');
  };

  const toggleType = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onTypesChange(newTypes);
  };

  const clearAllFilters = () => {
    onTypesChange([]);
    onSearchChange('');
  };

  return (
    <div className="space-y-6">
      {/* Page title and actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Tabled Papers</h1>
          <p className="text-muted-foreground text-sm">
            Track papers tabled in WA parliament
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Search bar */}
          <div className="relative flex-1 min-w-0 sm:min-w-[250px] lg:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tabled items"
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

      {/* Filters - Collapsible */}
      <div className="bg-muted/50 rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Filter by Type</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="h-6 w-6 p-0"
              >
                {isFilterOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            {(selectedTypes.length > 0 || searchQuery) && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>
        </div>
        {isFilterOpen && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {typesLoading ? (
                <div className="text-sm text-muted-foreground">Loading types...</div>
              ) : (
                availableTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedTypes.includes(type) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleType(type)}
                  >
                    {type}
                  </Button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}