'use client';

import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  currentSort: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
  className?: string;
}

export function SortableHeader({ 
  children, 
  sortKey, 
  currentSort, 
  onSort, 
  className 
}: SortableHeaderProps) {
  const isActive = currentSort?.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  return (
    <Button
      variant="ghost"
      className={`h-auto p-0 font-medium text-left justify-start hover:bg-transparent ${className}`}
      onClick={() => onSort(sortKey)}
    >
      {children}
      <span className="ml-1">
        {direction === 'asc' ? (
          <ChevronUp className="h-4 w-4" />
        ) : direction === 'desc' ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        )}
      </span>
    </Button>
  );
}