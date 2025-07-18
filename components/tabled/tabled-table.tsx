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
import { Eye, ExternalLinkIcon, AlertCircle, Flag, Check } from 'lucide-react';
import { TabledDetailDrawer } from './tabled-detail-drawer';
import { SortableHeader } from '@/components/ui/sortable-header';
import { Tabled } from '@/lib/dbSchema';
import { getTabledItems } from '@/lib/actions/tabled';

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
    if (item.link) {
      window.open(item.link, '_blank');
    }
  };

  const handleFlag = async (item: Tabled, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement flag functionality
    const newFlaggedState = !item.is_flagged;
    
    // Update local state optimistically
    setTabledItems(prev => prev.map(t => 
      t.id === item.id ? { ...t, is_flagged: newFlaggedState } : t
    ));
    
    // TODO: Call API to update database
    console.log(`Flagging item ${item.id}: ${newFlaggedState}`);
  };

  const handleReview = async (item: Tabled, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement review functionality
    const newReviewedState = !item.is_reviewed;
    
    // Update local state optimistically
    setTabledItems(prev => prev.map(t => 
      t.id === item.id ? { ...t, is_reviewed: newReviewedState } : t
    ));
    
    // TODO: Call API to update database
    console.log(`Reviewing item ${item.id}: ${newReviewedState}`);
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <SortableHeader
                  sortKey="date"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Date
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[150px]">
                <SortableHeader
                  sortKey="type"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Type
                </SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader
                  sortKey="name"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Name
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[120px]">
                <SortableHeader
                  sortKey="paper_no"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Paper No.
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tabledItems.map((item) => {
              return (
                <TableRow
                  key={item.id}
                  className="data-table-row cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(item)}
                >
                  <TableCell className="font-medium">
                    {item.date ? formatDate(item.date, 'MMM dd') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium text-sm ${getTypeColor(item.type || 'Unknown')}`}>
                      {item.type || 'Unknown'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="font-medium leading-tight line-clamp-2 text-sm">
                        {item.name || 'Untitled'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.paper_no || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => handleViewDetails(item, e)}
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="sr-only">View details</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => handleExternalLink(item, e)}
                        disabled={!item.link}
                        title="Open in new tab"
                      >
                        <ExternalLinkIcon className="h-3.5 w-3.5" />
                        <span className="sr-only">Open external link</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 ${item.is_flagged ? 'text-red-500' : ''}`}
                        onClick={(e) => handleFlag(item, e)}
                        title="Flag for attention"
                      >
                        <Flag className="h-3.5 w-3.5" />
                        <span className="sr-only">Flag</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 ${item.is_reviewed ? 'text-green-500' : ''}`}
                        onClick={(e) => handleReview(item, e)}
                        title="Mark as reviewed"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span className="sr-only">Mark as reviewed</span>
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