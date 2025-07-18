'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, RefreshCw, X } from 'lucide-react';

interface TabledHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  onRefresh?: () => void;
}

const AVAILABLE_TYPES = [
  'Motion',
  'Notice',
  'Bill',
  'Report',
  'Petition',
  'Amendment',
  'Question',
  'Statement'
];

export function TabledHeader({ 
  searchQuery, 
  onSearchChange, 
  selectedTypes, 
  onTypesChange, 
  onRefresh 
}: TabledHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
          <h1 className="text-4xl font-bold tracking-tight">Tabled</h1>
          <p className="text-muted-foreground text-sm">
            Track parliamentary papers and motions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[300px]">
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
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {selectedTypes.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedTypes.length}
                </Badge>
              )}
            </Button>
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

      {/* Filters */}
      {showFilters && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filter by Type</h3>
            {(selectedTypes.length > 0 || searchQuery) && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TYPES.map((type) => (
              <Button
                key={type}
                variant={selectedTypes.includes(type) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}