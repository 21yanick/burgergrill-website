/**
 * 📱 LIVE PREVIEW COMPONENT
 * Real-time preview of how opening hours appear on the website
 * 
 * Features:
 * - Live simulation of website opening hours display
 * - Current status indicator (open/closed)
 * - Today highlighting and status messages
 * - Responsive preview (desktop/mobile)
 * - Special hours integration (holidays/vacations)
 * - Real-time updates when data changes
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  Monitor, 
  Smartphone, 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useOpeningHours, useRestaurantStatus } from '@/hooks/restaurant/use-opening-hours';
import type { WeeklyHoursData, RestaurantStatus } from '@/types/database';

// =====================================================================================
// TYPES & INTERFACES
// =====================================================================================

export interface LivePreviewProps {
  /** Additional CSS classes */
  className?: string;
  
  /** Whether to show the preview in compact mode */
  compact?: boolean;
  
  /** Custom weekly hours data (for preview purposes) */
  previewData?: WeeklyHoursData | null;
}

interface OpeningHoursPreviewProps {
  weeklyHours: WeeklyHoursData | null;
  status: RestaurantStatus | null;
  viewMode: 'desktop' | 'mobile';
}

// =====================================================================================
// OPENING HOURS PREVIEW COMPONENT
// =====================================================================================

/**
 * Simulates the actual OpeningHours component from the website
 * This should match the styling and behavior of /components/restaurant/location/opening-hours.tsx
 */
function OpeningHoursPreview({ weeklyHours, status, viewMode }: OpeningHoursPreviewProps) {
  if (!weeklyHours) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">Öffnungszeiten werden geladen...</span>
        </div>
      </div>
    );
  }

  // Convert WeeklyHoursData to display format
  const daysConfig = [
    { key: 'monday' as keyof WeeklyHoursData, label: 'Montag' },
    { key: 'tuesday' as keyof WeeklyHoursData, label: 'Dienstag' },
    { key: 'wednesday' as keyof WeeklyHoursData, label: 'Mittwoch' },
    { key: 'thursday' as keyof WeeklyHoursData, label: 'Donnerstag' },
    { key: 'friday' as keyof WeeklyHoursData, label: 'Freitag' },
    { key: 'saturday' as keyof WeeklyHoursData, label: 'Samstag' },
    { key: 'sunday' as keyof WeeklyHoursData, label: 'Sonntag' },
  ];

  // Get current day (0=Monday, 6=Sunday)
  const getCurrentDay = () => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1; // Convert Sunday=0 to Sunday=6, Monday=1 to Monday=0
  };

  const currentDayIndex = getCurrentDay();

  return (
    <Card className={cn(
      'w-full transition-all duration-200',
      viewMode === 'mobile' && 'max-w-sm mx-auto'
    )}>
      <CardHeader className={cn(
        viewMode === 'mobile' ? 'p-4' : 'p-6'
      )}>
        <CardTitle className={cn(
          'flex items-center gap-2',
          viewMode === 'mobile' ? 'text-lg' : 'text-xl'
        )}>
          <Clock className={cn(
            'text-accent',
            viewMode === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'
          )} />
          Öffnungszeiten
        </CardTitle>
        
        {/* Current Status Banner */}
        {status && (
          <div className={cn(
            'flex items-center gap-2 mt-2',
            viewMode === 'mobile' ? 'text-sm' : 'text-base'
          )}>
            {status.isOpen ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Aktuell geöffnet
                </Badge>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-500" />
                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                  Aktuell geschlossen
                </Badge>
              </>
            )}
          </div>
        )}
        
        {status?.currentMessage && (
          <p className={cn(
            'text-muted-foreground',
            viewMode === 'mobile' ? 'text-xs' : 'text-sm'
          )}>
            {status.currentMessage}
          </p>
        )}
      </CardHeader>
      
      <CardContent className={cn(
        viewMode === 'mobile' ? 'p-4 pt-0' : 'p-6 pt-0'
      )}>
        <div className="space-y-2">
          {daysConfig.map((day, index) => {
            const isToday = index === currentDayIndex;
            const dayHours = weeklyHours[day.key];
            const isOpen = dayHours?.isOpen ?? false;
            
            return (
              <div 
                key={day.key}
                className={cn(
                  'flex justify-between items-center py-2 px-3 rounded-md transition-colors',
                  isToday 
                    ? 'bg-accent/10 border border-accent/20' 
                    : 'hover:bg-muted/50',
                  viewMode === 'mobile' && 'py-1.5 px-2'
                )}
              >
                <span className={cn(
                  'font-medium',
                  isToday ? 'text-accent' : '',
                  viewMode === 'mobile' ? 'text-sm' : 'text-base'
                )}>
                  {day.label}
                  {isToday && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'ml-2 bg-accent text-accent-foreground border-accent/20',
                        viewMode === 'mobile' ? 'text-xs px-1.5 py-0' : 'text-xs px-2 py-0.5'
                      )}
                    >
                      Heute
                    </Badge>
                  )}
                </span>
                
                <span className={cn(
                  !isOpen 
                    ? 'text-muted-foreground' 
                    : isToday 
                      ? 'text-accent font-medium' 
                      : '',
                  viewMode === 'mobile' ? 'text-sm' : 'text-base'
                )}>
                  {isOpen ? (
                    dayHours.openTime && dayHours.closeTime 
                      ? `${dayHours.openTime} - ${dayHours.closeTime}`
                      : 'Zeiten nicht verfügbar'
                  ) : (
                    'Geschlossen'
                  )}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className={cn(
          'mt-4 pt-4 border-t text-muted-foreground',
          viewMode === 'mobile' ? 'text-xs' : 'text-sm'
        )}>
          <p>* Feiertage können abweichen</p>
          {status?.nextOpening && (
            <p className="mt-1">Nächste Öffnung: {status.nextOpening}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================================================
// LIVE PREVIEW COMPONENT
// =====================================================================================

export function LivePreview({ 
  className, 
  compact = false, 
  previewData = null 
}: LivePreviewProps) {
  // Hooks for real-time data
  const { weeklyHours, loading, error } = useOpeningHours();
  const { status, loading: statusLoading } = useRestaurantStatus();
  
  // Local state
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // Use preview data if provided, otherwise use real data
  const displayData = previewData || weeklyHours;

  // Update timestamp when data changes
  React.useEffect(() => {
    if (displayData) {
      setLastUpdateTime(new Date());
    }
  }, [displayData]);

  // Count open days for statistics
  const openDaysCount = useMemo(() => {
    if (!displayData) return 0;
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
    return dayKeys.reduce((count, day) => {
      return count + (displayData[day]?.isOpen ? 1 : 0);
    }, 0);
  }, [displayData]);

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Website-Vorschau
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OpeningHoursPreview 
            weeklyHours={displayData}
            status={status}
            viewMode="mobile"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Live Website-Vorschau
            </CardTitle>
            <CardDescription>
              So erscheinen Ihre Öffnungszeiten auf der Website
            </CardDescription>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className="flex items-center gap-2"
            >
              <Monitor className="w-3 w-3" />
              Desktop
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className="flex items-center gap-2"
            >
              <Smartphone className="w-3 h-3" />
              Mobil
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Statistics */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{openDaysCount} von 7 Tagen geöffnet</span>
          </div>
          
          {status && (
            <div className="flex items-center gap-2">
              {status.isOpen ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span>{status.isOpen ? 'Aktuell geöffnet' : 'Aktuell geschlossen'}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>
              Aktualisiert: {lastUpdateTime.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">
              Fehler beim Laden der Vorschau: {error}
            </p>
          </div>
        )}

        {/* Loading State */}
        {(loading || statusLoading) && !displayData && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Vorschau wird geladen...</span>
            </div>
          </div>
        )}

        {/* Preview Container */}
        <div className={cn(
          'border rounded-lg overflow-hidden bg-background',
          viewMode === 'desktop' ? 'p-6' : 'p-2'
        )}>
          <OpeningHoursPreview 
            weeklyHours={displayData}
            status={status}
            viewMode={viewMode}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Diese Vorschau zeigt, wie Kunden Ihre Öffnungszeiten auf der Website sehen.
          </p>
          
          <Button variant="outline" size="sm" asChild>
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-3 h-3" />
              Website öffnen
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================================================
// EXPORT
// =====================================================================================

export default LivePreview;