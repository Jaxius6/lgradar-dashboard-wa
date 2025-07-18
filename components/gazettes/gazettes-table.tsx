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
import { formatDate, formatCountdown, getRiskBadgeVariant } from '@/lib/utils';
import { Eye, ExternalLinkIcon, Clock, AlertCircle, Flag, Check } from 'lucide-react';
import { GazetteDetailDrawer } from './gazette-detail-drawer';
import { SortableHeader } from '@/components/ui/sortable-header';
import { Gazette } from '@/lib/dbSchema';
import { getGazettes } from '@/lib/actions/gazettes';
import { calculateRiskRating, isGazetteRelevant, getDaysUntilNextSitting } from '@/lib/gazette-utils';

interface GazetteTableProps {
  searchQuery?: string;
}

export function GazettesTable({ searchQuery }: GazetteTableProps) {
  const [gazettes, setGazettes] = useState<Gazette[]>([]);
  const [selectedGazette, setSelectedGazette] = useState<Gazette | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    async function fetchGazettes() {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await getGazettes({
        search: searchQuery,
        limit: 50
      });
      
      if (fetchError) {
        setError(fetchError);
      } else {
        setGazettes(data);
      }
      
      setLoading(false);
    }

    fetchGazettes();
  }, [searchQuery]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    // Sort the items
    const sortedItems = [...gazettes].sort((a, b) => {
      let aValue: any = a[key as keyof Gazette];
      let bValue: any = b[key as keyof Gazette];

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

    setGazettes(sortedItems);
  };

  const handleRowClick = (gazette: Gazette) => {
    setSelectedGazette(gazette);
    setIsDrawerOpen(true);
  };

  const handleViewDetails = (gazette: Gazette, e: React.MouseEvent) => {
    e.stopPropagation();
    handleRowClick(gazette);
  };

  const handleExternalLink = (gazette: Gazette, e: React.MouseEvent) => {
    e.stopPropagation();
    if (gazette.link) {
      window.open(gazette.link, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading gazettes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium mb-2">Error loading gazettes</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (gazettes.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No gazettes found.</p>
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
                  sortKey="pubdate"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Published
                </SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader
                  sortKey="title"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Title
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[150px]">
                <SortableHeader
                  sortKey="jurisdiction"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Jurisdiction
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[100px]">
                <SortableHeader
                  sortKey="category"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Category
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[100px]">
                <SortableHeader
                  sortKey="date"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Effective
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[120px]">
                <SortableHeader
                  sortKey="next_sit"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Disallowance
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gazettes.map((gazette) => {
              const riskRating = calculateRiskRating(gazette);
              const daysUntilSitting = getDaysUntilNextSitting(gazette);
              
              return (
                <TableRow
                  key={gazette.id}
                  className="data-table-row cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(gazette)}
                >
                  <TableCell className="font-medium">
                    {gazette.pubdate ? formatDate(gazette.pubdate, 'MMM dd') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 max-w-md">
                      {gazette.emoji && (
                        <span className="text-lg flex-shrink-0">{gazette.emoji}</span>
                      )}
                      <p className="font-medium leading-tight line-clamp-2 text-sm">
                        {gazette.title || 'Untitled'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">
                      {gazette.jurisdiction || 'Unknown'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {gazette.category || 'General'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {gazette.date ? formatDate(gazette.date, 'MMM dd') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {gazette.next_sit ? (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className={`text-sm ${daysUntilSitting !== null && daysUntilSitting < 7 && daysUntilSitting >= 0 ? 'text-red-500 font-medium' : ''}`}>
                          {daysUntilSitting !== null ? (
                            daysUntilSitting > 0 ? (
                              `${daysUntilSitting} days`
                            ) : (
                              'Passed'
                            )
                          ) : (
                            formatDate(gazette.next_sit, 'MMM dd')
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => handleViewDetails(gazette, e)}
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="sr-only">View details</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => handleExternalLink(gazette, e)}
                        disabled={!gazette.link}
                        title="Open in new tab"
                      >
                        <ExternalLinkIcon className="h-3.5 w-3.5" />
                        <span className="sr-only">Open external link</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 ${gazette.is_flagged ? 'text-red-500' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Toggle flag state optimistically
                          const newFlaggedState = !gazette.is_flagged;
                          setGazettes(prev => prev.map(g =>
                            g.id === gazette.id ? { ...g, is_flagged: newFlaggedState } : g
                          ));
                          // TODO: Call API to update database
                          console.log(`Flagging gazette ${gazette.id}: ${newFlaggedState}`);
                        }}
                        title="Flag for attention"
                      >
                        <Flag className="h-3.5 w-3.5" />
                        <span className="sr-only">Flag</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 ${gazette.is_reviewed ? 'text-green-500' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Toggle review state optimistically
                          const newReviewedState = !gazette.is_reviewed;
                          setGazettes(prev => prev.map(g =>
                            g.id === gazette.id ? { ...g, is_reviewed: newReviewedState } : g
                          ));
                          // TODO: Call API to update database
                          console.log(`Reviewing gazette ${gazette.id}: ${newReviewedState}`);
                        }}
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

      <GazetteDetailDrawer
        gazette={selectedGazette}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </>
  );
}