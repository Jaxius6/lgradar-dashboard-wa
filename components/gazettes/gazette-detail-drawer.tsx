'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, getRiskBadgeVariant } from '@/lib/utils';
import { X, ExternalLink, Clock, Calendar, Building, FileText, Hash, User } from 'lucide-react';
import { Gazette } from '@/lib/dbSchema';
import { calculateRiskRating, isGazetteRelevant, getDaysUntilNextSitting } from '@/lib/gazette-utils';

interface GazetteDetailDrawerProps {
  gazette: Gazette | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GazetteDetailDrawer({ gazette, open, onOpenChange }: GazetteDetailDrawerProps) {
  if (!gazette || !open) return null;

  const riskRating = calculateRiskRating(gazette);
  const isRelevant = isGazetteRelevant(gazette);
  const daysUntilSitting = getDaysUntilNextSitting(gazette);

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
              <div className="flex items-center gap-2">
                {gazette.emoji && <span className="text-xl">{gazette.emoji}</span>}
                <h2 className="text-2xl font-bold leading-tight">
                  {gazette.title || 'Untitled Gazette'}
                </h2>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  {gazette.jurisdiction || 'Unknown Jurisdiction'}
                </span>
                {gazette.gaz_id && (
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {gazette.gaz_id}
                  </span>
                )}
                {gazette.gaz_num && (
                  <span className="flex items-center">
                    <Hash className="h-4 w-4 mr-1" />
                    {gazette.gaz_num}
                  </span>
                )}
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
            <Badge variant={getRiskBadgeVariant(riskRating)}>
              {riskRating} risk
            </Badge>
            {isRelevant && (
              <Badge variant="default">Relevant</Badge>
            )}
            {gazette.category && (
              <Badge variant="outline">{gazette.category}</Badge>
            )}
          </div>

          {/* Key information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Published Date
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {gazette.pubdate ? (
                  <>
                    <p className="text-lg font-semibold">
                      {formatDate(gazette.pubdate, 'PPP')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(gazette.pubdate, 'p')}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Not specified</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Effective Date
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {gazette.date ? (
                  <>
                    <p className="text-lg font-semibold">
                      {formatDate(gazette.date, 'PPP')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(gazette.date, 'p')}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Not specified</p>
                )}
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
                {gazette.next_sit ? (
                  <>
                    <p className="text-lg font-semibold">
                      {formatDate(gazette.next_sit, 'PPP')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {daysUntilSitting !== null ? (
                        daysUntilSitting > 0 ? (
                          `${daysUntilSitting} days remaining`
                        ) : (
                          'Date has passed'
                        )
                      ) : (
                        'Check date'
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Not scheduled</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Impact/Summary */}
          {gazette.impact && (
            <Card>
              <CardHeader>
                <CardTitle>Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {gazette.impact}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {gazette.act && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Act</p>
                  <p className="text-sm">{gazette.act}</p>
                </div>
              )}
              {gazette.author && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Author</p>
                  <p className="text-sm flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {gazette.author}
                  </p>
                </div>
              )}
              {gazette.numpages && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pages</p>
                  <p className="text-sm">{gazette.numpages} pages</p>
                </div>
              )}
              {gazette.created_at && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">{formatDate(gazette.created_at, 'PPP')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-4 border-t">
            <Button
              className="flex-1"
              onClick={() => gazette.link && window.open(gazette.link, '_blank')}
              disabled={!gazette.link}
            >
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