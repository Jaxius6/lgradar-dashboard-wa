'use client';

import { useState } from 'react';
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
import { Eye, ExternalLink, Clock } from 'lucide-react';
import { GazetteDetailDrawer } from './gazette-detail-drawer';

// Mock data - replace with real data from Supabase
const mockGazettes = [
  {
    id: '1',
    title: 'Local Planning Policy Amendment - Residential Development Standards',
    summary: 'Proposed changes to minimum lot sizes and building setbacks in residential zones.',
    publication_date: '2025-01-03T09:00:00Z',
    council_name: 'City of Perth',
    risk_rating: 'high' as const,
    disallowance_deadline: '2025-01-17T17:00:00Z',
    is_relevant: true,
    gazette_number: 'G001/2025',
  },
  {
    id: '2',
    title: 'Waste Management Local Law 2025',
    summary: 'New regulations for commercial waste collection and disposal requirements.',
    publication_date: '2025-01-02T14:30:00Z',
    council_name: 'City of Fremantle',
    risk_rating: 'medium' as const,
    disallowance_deadline: '2025-01-16T17:00:00Z',
    is_relevant: false,
    gazette_number: 'G002/2025',
  },
  {
    id: '3',
    title: 'Public Open Space Contribution Policy',
    summary: 'Updated contribution rates for public open space in new developments.',
    publication_date: '2025-01-01T11:15:00Z',
    council_name: 'City of Joondalup',
    risk_rating: 'low' as const,
    disallowance_deadline: '2025-01-15T17:00:00Z',
    is_relevant: true,
    gazette_number: 'G003/2025',
  },
  {
    id: '4',
    title: 'Parking Management Strategy Implementation',
    summary: 'New paid parking zones and time restrictions in commercial areas.',
    publication_date: '2024-12-30T16:45:00Z',
    council_name: 'City of Subiaco',
    risk_rating: 'medium' as const,
    disallowance_deadline: '2025-01-13T17:00:00Z',
    is_relevant: true,
    gazette_number: 'G004/2025',
  },
  {
    id: '5',
    title: 'Heritage Conservation Area Expansion',
    summary: 'Extension of heritage protection to additional properties in the town centre.',
    publication_date: '2024-12-29T10:20:00Z',
    council_name: 'Town of Cottesloe',
    risk_rating: 'high' as const,
    disallowance_deadline: '2025-01-12T17:00:00Z',
    is_relevant: false,
    gazette_number: 'G005/2025',
  },
];

export function GazettesTable() {
  const [selectedGazette, setSelectedGazette] = useState<typeof mockGazettes[0] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (gazette: typeof mockGazettes[0]) => {
    setSelectedGazette(gazette);
    setIsDrawerOpen(true);
  };

  const handleViewDetails = (gazette: typeof mockGazettes[0], e: React.MouseEvent) => {
    e.stopPropagation();
    handleRowClick(gazette);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[150px]">Council</TableHead>
              <TableHead className="w-[100px]">Risk</TableHead>
              <TableHead className="w-[120px]">Countdown</TableHead>
              <TableHead className="w-[100px]">Relevant</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockGazettes.map((gazette) => (
              <TableRow
                key={gazette.id}
                className="data-table-row"
                onClick={() => handleRowClick(gazette)}
              >
                <TableCell className="font-medium">
                  {formatDate(gazette.publication_date, 'MMM dd')}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{gazette.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {gazette.summary}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{gazette.council_name}</p>
                    <p className="text-xs text-muted-foreground">{gazette.gazette_number}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRiskBadgeVariant(gazette.risk_rating)}>
                    {gazette.risk_rating}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="countdown-timer">
                      {formatCountdown(gazette.disallowance_deadline)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {gazette.is_relevant ? (
                    <Badge variant="brand" className="text-xs">
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      No
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => handleViewDetails(gazette, e)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Open external link
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Open external link</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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