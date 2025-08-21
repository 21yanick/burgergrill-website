/**
 * 🎯 SIMPLE HOLIDAY BANNER
 * Shows active holiday message on website
 * 
 * KISS principle: Receives holiday data as props (server-side fetched)
 * No client-side data fetching, clean separation of concerns
 * Simple and effective.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpecialHours } from '@/types/database';

// =====================================================================================
// TYPES
// =====================================================================================

export interface HolidayBannerProps {
  /** Active holiday data (from server) */
  holiday: SpecialHours;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Whether to show in compact mode */
  compact?: boolean;
}

// =====================================================================================
// HELPER FUNCTIONS
// =====================================================================================

function formatDateRangeForCustomers(startDate: string, endDate: string): string {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    
    if (startDate === endDate) {
      return `am ${start.toLocaleDateString('de-DE', formatOptions)}`;
    } else {
      return `vom ${start.toLocaleDateString('de-DE', formatOptions)} bis ${end.toLocaleDateString('de-DE', formatOptions)}`;
    }
  } catch {
    return `${startDate} - ${endDate}`;
  }
}

// =====================================================================================
// MAIN COMPONENT
// =====================================================================================

export function HolidayBanner({ holiday, className, compact = false }: HolidayBannerProps) {
  const dateRange = formatDateRangeForCustomers(
    holiday.date_start, 
    holiday.date_end
  );

  return (
    <div className={cn(
      'border rounded-lg border-amber-500/20 bg-amber-500/10 dark:border-amber-400/30 dark:bg-amber-400/10 text-center relative',
      compact ? 'py-6 px-4 pt-12' : 'py-8 px-6 pt-14',
      className
    )}>
      {/* Badge - top right */}
      <Badge 
        variant="outline" 
        className={cn(
          'absolute top-3 right-3 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 dark:border-amber-400/30 font-medium',
          compact ? 'text-xs px-2 py-1' : 'text-sm px-2 py-1'
        )}
      >
        Geschlossen
      </Badge>
      
      {/* Main Message */}
      <div className={cn(
        'text-amber-900 dark:text-amber-100 font-semibold leading-relaxed mb-4',
        compact ? 'text-base' : 'text-lg'
      )}>
        {holiday.custom_message}
      </div>
      
      {/* Date Range with icon */}
      <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300">
        <Calendar className={cn(
          'flex-shrink-0',
          compact ? 'w-4 h-4' : 'w-5 h-5'
        )} />
        <span className={cn(
          'font-medium',
          compact ? 'text-sm' : 'text-base'
        )}>
          Geschlossen {dateRange}
        </span>
      </div>
    </div>
  );
}

export default HolidayBanner;