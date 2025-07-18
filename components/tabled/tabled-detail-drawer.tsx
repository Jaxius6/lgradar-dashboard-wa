'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { ExternalLinkIcon, Flag, Check, Calendar, FileText, Hash, X } from 'lucide-react';
import { Tabled } from '@/lib/dbSchema';

interface TabledDetailDrawerProps {
  item: Tabled | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TabledDetailDrawer({ item, open, onOpenChange }: TabledDetailDrawerProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!item || !open) return null;

  const handleFlag = async () => {
    setIsUpdating(true);
    // TODO: Implement flag functionality
    console.log(`Flagging item ${item.id}`);
    setIsUpdating(false);
  };

  const handleReview = async () => {
    setIsUpdating(true);
    // TODO: Implement review functionality
    console.log(`Reviewing item ${item.id}`);
    setIsUpdating(false);
  };

  const handleOpenLink = () => {
    // Use 'url' column if it exists, otherwise fall back to 'link'
    const linkUrl = item.url || item.link;
    if (linkUrl) {
      window.open(linkUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => onOpenChange(false)}>
      <div
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l border-border overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold leading-tight">
                {item.name || 'Untitled'}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {item.type || 'Unknown'}
                </Badge>
                {item.is_flagged && (
                  <Badge variant="destructive" className="text-xs">
                    <Flag className="h-3 w-3 mr-1" />
                    Flagged
                  </Badge>
                )}
                {item.is_reviewed && (
                  <Badge variant="default" className="text-xs bg-green-600">
                    <Check className="h-3 w-3 mr-1" />
                    Reviewed
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                Parliamentary paper details and metadata
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="space-y-6">
          {/* Key Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Key Information
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {item.date ? formatDate(item.date, 'MMMM dd, yyyy') : 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Paper Number</p>
                  <p className="text-sm text-muted-foreground">
                    {item.paper_no || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground">
                    {item.type || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Actions
            </h3>
            
            <div className="flex flex-col space-y-2">
              {(item.url || item.link) && (
                <Button
                  variant="outline"
                  onClick={handleOpenLink}
                  className="justify-start"
                >
                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                  Open Document in New Tab
                </Button>
              )}
              
              <Button
                variant={item.is_flagged ? "destructive" : "outline"}
                onClick={handleFlag}
                disabled={isUpdating}
                className="justify-start"
              >
                <Flag className="h-4 w-4 mr-2" />
                {item.is_flagged ? 'Remove Flag' : 'Flag for Attention'}
              </Button>
              
              <Button
                variant={item.is_reviewed ? "default" : "outline"}
                onClick={handleReview}
                disabled={isUpdating}
                className={`justify-start ${item.is_reviewed ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                <Check className="h-4 w-4 mr-2" />
                {item.is_reviewed ? 'Mark as Unreviewed' : 'Mark as Reviewed'}
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Metadata
            </h3>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>ID: {item.id}</p>
              {item.created_at && (
                <p>Created: {formatDate(item.created_at, 'MMM dd, yyyy HH:mm')}</p>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}