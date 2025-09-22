'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Archive, ExternalLinkIcon, AlertCircle, Flag } from 'lucide-react';
import { TabledDetailDrawer } from './tabled-detail-drawer';
import { SortableHeader } from '@/components/ui/sortable-header';
import { Tabled } from '@/lib/dbSchema';
import { getTabledItems, updateTabledItemFlag, updateTabledItemReview } from '@/lib/actions/tabled';

// Type color mapping
const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    'Petition': 'text-purple-600',
    'Motion': 'text-blue-600',
    'Notice': 'text-green-600',
    'Bill': 'text-red-600',
    'Report': 'text-orange-600',
    'Amendment': 'text-yellow-600',
    'Question': 'text-pink-600',
    'Statement': 'text-indigo-600',
    'Paper': 'text-teal-600',
    'Document': 'text-cyan-600',
  };
  return colors[type] || 'text-gray-600';
};

interface TabledTableProps {
  searchQuery?: string;
  selectedTypes?: string[];
}

export function TabledTable({ searchQuery, selectedTypes }: TabledTableProps) {
  const [tabledItems, setTabledItems] = useState<Tabled[]>([]);
  const [selectedItem, setSelectedItem] = useState<Tabled | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    async function fetchTabledItems() {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await getTabledItems({
        search: searchQuery,
        types: selectedTypes,
        limit: 50
      });
      
      if (fetchError) {
        setError(fetchError);
      } else {
        setTabledItems(data);
      }
      
      setLoading(false);
    }

    fetchTabledItems();
  }, [searchQuery, selectedTypes]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    // Sort the items
    const sortedItems = [...tabledItems].sort((a, b) => {
      let aValue: any = a[key as keyof Tabled];
      let bValue: any = b[key as keyof Tabled];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      // Convert to string for comparison
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();

      if (direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setTabledItems(sortedItems);
  };

  const handleRowClick = (item: Tabled) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleViewDetails = (item: Tabled, e: React.MouseEvent) => {
    e.stopPropagation();
    handleRowClick(item);
  };

  const handleExternalLink = (item: Tabled, e: React.MouseEvent) => {
    e.stopPropagation();
    // Use 'url' column if it exists, otherwise fall back to 'link'
    const linkUrl = item.url || item.link;
    if (linkUrl) {
      try {
        // Ensure URL has protocol
        let url = linkUrl;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Failed to open link:', error);
        // Fallback: try opening the original link
        window.open(linkUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleFlag = async (item: Tabled, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFlaggedState = !item.is_flagged;
    
    // Update local state optimistically
    setTabledItems(prev => prev.map(t =>
      t.id === item.id ? { ...t, is_flagged: newFlaggedState } : t
    ));
    
    // Call API to update database
    const result = await updateTabledItemFlag(item.id, newFlaggedState);
    if (result.error) {
      // Revert on error
      setTabledItems(prev => prev.map(t =>
        t.id === item.id ? { ...t, is_flagged: !newFlaggedState } : t
      ));
      console.error('Failed to update flag:', result.error);
    }
  };

  const handleArchive = async (item: Tabled, e: React.MouseEvent) => {
    e.stopPropagation();
    const newArchivedState = !item.is_reviewed;
    
    // Update local state optimistically
    setTabledItems(prev => prev.map(t =>
      t.id === item.id ? { ...t, is_reviewed: newArchivedState } : t
    ));
    
    // Call API to update database
    const result = await updateTabledItemReview(item.id, newArchivedState);
    if (result.error) {
      // Revert on error
      setTabledItems(prev => prev.map(t =>
        t.id === item.id ? { ...t, is_reviewed: !newArchivedState } : t
      ));
      console.error('Failed to update archive status:', result.error);
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tabled items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium mb-2">Error loading tabled items</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (tabledItems.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No tabled items found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="h-10">
              <TableHead className="w-[90px] py-2">
                <SortableHeader
                  sortKey="date"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Date
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[120px] py-2">
                <SortableHeader
                  sortKey="type"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Type
                </SortableHeader>
              </TableHead>
              <TableHead className="py-2">
                <SortableHeader
                  sortKey="name"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Name
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[100px] py-2">
                <SortableHeader
                  sortKey="paper_no"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Paper No.
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[110px] py-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tabledItems.map((item) => {
              return (
                <TableRow
                  key={item.id}
                  className="data-table-row cursor-pointer hover:bg-muted/50 h-12"
                  onClick={() => handleRowClick(item)}
                >
                  <TableCell className="font-medium text-xs py-2">
                    {item.date ? formatDate(item.date, 'dd/MM/yy') : 'N/A'}
                  </TableCell>
                  <TableCell className="py-2">
                    <span className={`font-medium text-xs ${getTypeColor(item.type || 'Unknown')}`}>
                      {item.type || 'Unknown'}
                    </span>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="max-w-md">
                      <p className="font-medium leading-tight line-clamp-2 text-xs">
                        {item.name || 'Untitled'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-xs py-2">
                    {item.paper_no || 'N/A'}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => handleExternalLink(item, e)}
                        disabled={!item.url && !item.link}
                        title="Open in new tab"
                      >
                        <ExternalLinkIcon className="h-3 w-3" />
                        <span className="sr-only">Open external link</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 ${item.is_flagged ? 'text-red-500' : ''}`}
                        onClick={(e) => handleFlag(item, e)}
                        title="Flag for attention"
                      >
                        <Flag className="h-3 w-3" />
                        <span className="sr-only">Flag</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 ${item.is_reviewed ? 'text-blue-500' : ''}`}
                        onClick={(e) => handleArchive(item, e)}
                        title="Archive"
                      >
                        <Archive className="h-3 w-3" />
                        <span className="sr-only">Archive</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <TabledDetailDrawer
        item={selectedItem}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </>
  );
}