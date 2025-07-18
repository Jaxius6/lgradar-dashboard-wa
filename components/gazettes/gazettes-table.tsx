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
import { Eye, ExternalLink, Clock, AlertCircle, Flag, Check, Globe } from 'lucide-react';
import { GazetteDetailDrawer } from './gazette-detail-drawer';
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
              <TableHead className="w-[100px]">Published</TableHead>
              <TableHead className="w-[100px]">Effective</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[150px]">Jurisdiction</TableHead>
              <TableHead className="w-[100px]">Category</TableHead>
              <TableHead className="w-[100px]">Risk</TableHead>
              <TableHead className="w-[120px]">Disallowance</TableHead>
              <TableHead className="w-[140px]">Actions</TableHead>
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
                  <TableCell className="font-medium">
                    {gazette.date ? formatDate(gazette.date, 'MMM dd') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {gazette.emoji && (
                        <span className="text-lg">{gazette.emoji}</span>
                      )}
                      <p className="font-medium leading-none">
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
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(riskRating)}>
                      {riskRating}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {gazette.next_sit ? (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
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
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => handleViewDetails(gazette, e)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => handleExternalLink(gazette, e)}
                        disabled={!gazette.link}
                        title="Open in new tab"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="sr-only">Open external link</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement flag functionality
                        }}
                        title="Flag for attention"
                      >
                        <Flag className="h-4 w-4" />
                        <span className="sr-only">Flag</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement mark as reviewed functionality
                        }}
                        title="Mark as reviewed"
                      >
                        <Check className="h-4 w-4" />
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