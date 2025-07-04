'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCountdown, getRiskBadgeVariant } from '@/lib/utils';
import { X, ExternalLink, Clock, Calendar, Building, FileText } from 'lucide-react';

interface Gazette {
  id: string;
  title: string;
  summary: string;
  publication_date: string;
  council_name: string;
  risk_rating: 'low' | 'medium' | 'high';
  disallowance_deadline: string;
  is_relevant: boolean;
  gazette_number: string;
}

interface GazetteDetailDrawerProps {
  gazette: Gazette | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GazetteDetailDrawer({ gazette, open, onOpenChange }: GazetteDetailDrawerProps) {
  if (!gazette || !open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => onOpenChange(false)}>
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l border-border overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold leading-tight">{gazette.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  {gazette.council_name}
                </span>
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  {gazette.gazette_number}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Status badges */}
          <div className="flex items-center space-x-2">
            <Badge variant={getRiskBadgeVariant(gazette.risk_rating)}>
              {gazette.risk_rating} risk
            </Badge>
            {gazette.is_relevant && (
              <Badge variant="brand">Relevant</Badge>
            )}
          </div>

          {/* Key information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Publication Date
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-lg font-semibold">
                  {formatDate(gazette.publication_date, 'PPP')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(gazette.publication_date, 'p')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Disallowance Deadline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-lg font-semibold">
                  {formatDate(gazette.disallowance_deadline, 'PPP')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCountdown(gazette.disallowance_deadline)} remaining
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {gazette.summary}
              </p>
            </CardContent>
          </Card>

          {/* Full content placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Full Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                The full gazette content would be displayed here. This could include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Complete legislative text</li>
                <li>Detailed policy changes</li>
                <li>Implementation timelines</li>
                <li>Contact information</li>
                <li>Related documents</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-4 border-t">
            <Button className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Original Document
            </Button>
            <Button variant="outline">
              Add to Watchlist
            </Button>
            <Button variant="outline">
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}