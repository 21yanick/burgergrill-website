/**
 * 🗓️ WEEKLY EDITOR COMPONENT
 * Simple draft-mode editor for opening hours
 * 
 * Features:
 * - Draft state system - changes saved only on "Save" button
 * - Simple save/cancel functionality
 * - Today highlighting
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  Save, 
  X,
  CheckCircle, 
  AlertCircle, 
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { DayTimeEditor } from './day-time-editor';
import { useOpeningHours } from '@/hooks/restaurant/use-opening-hours';
import type { DayHours } from '@/lib/restaurant/actions/opening-hours';

// =====================================================================================
// TYPES & CONSTANTS
// =====================================================================================

interface WeeklyEditorProps {
  className?: string;
}

// German weekdays configuration
const WEEK_DAYS = [
  { key: 0, name: 'Montag' },
  { key: 1, name: 'Dienstag' },
  { key: 2, name: 'Mittwoch' },
  { key: 3, name: 'Donnerstag' },
  { key: 4, name: 'Freitag' },
  { key: 5, name: 'Samstag' },
  { key: 6, name: 'Sonntag' },
];

// Get current day of week (0=Monday, 6=Sunday)
function getCurrentDayOfWeek(): number {
  const jsDay = new Date().getDay(); // 0=Sunday, 6=Saturday
  return jsDay === 0 ? 6 : jsDay - 1; // Convert to our format: 0=Monday, 6=Sunday
}

// =====================================================================================
// WEEKLY EDITOR COMPONENT
// =====================================================================================

export function WeeklyEditor({ className }: WeeklyEditorProps) {
  const { weeklyHours, loading, error, saving, updateMultipleDays } = useOpeningHours();
  
  // Draft state - local changes before save
  const [draftHours, setDraftHours] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Initialize draft state when data loads
  useEffect(() => {
    if (weeklyHours && !draftHours) {
      setDraftHours({ ...weeklyHours });
    }
  }, [weeklyHours, draftHours]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = draftHours && weeklyHours && 
    JSON.stringify(draftHours) !== JSON.stringify(weeklyHours);

  // Handle day change - only update draft, don't save
  const handleDayChange = useCallback((dayOfWeek: number, hours: DayHours) => {
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayKey = dayKeys[dayOfWeek];
    
    setDraftHours(prev => ({
      ...prev,
      [dayKey]: hours
    }));
  }, []);

  // Save all changes
  const handleSave = useCallback(async () => {
    if (!draftHours || !hasUnsavedChanges) return;
    
    try {
      // Prepare updates array
      const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const updates = dayKeys.map((dayKey, index) => ({
        dayOfWeek: index,
        hours: draftHours[dayKey] || { isOpen: false, openTime: null, closeTime: null }
      }));

      await updateMultipleDays(updates);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
    }
  }, [draftHours, hasUnsavedChanges, updateMultipleDays]);

  // Cancel changes - reset to original
  const handleCancel = useCallback(() => {
    if (weeklyHours) {
      setDraftHours({ ...weeklyHours });
    }
  }, [weeklyHours]);

  const currentDay = getCurrentDayOfWeek();

  // Show loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Öffnungszeiten werden geladen...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!draftHours) return null;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Wöchentliche Öffnungszeiten</CardTitle>
              <CardDescription>
                Bearbeiten Sie die Öffnungszeiten für jeden Wochentag
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Success Message */}
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Öffnungszeiten erfolgreich gespeichert!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {WEEK_DAYS.map((day) => {
          const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          const dayHours = draftHours[dayKeys[day.key]] || { 
            isOpen: false, 
            openTime: null, 
            closeTime: null 
          };
          
          return (
            <DayTimeEditor
              key={day.key}
              dayName={day.name}
              hours={dayHours}
              onUpdate={(hours) => handleDayChange(day.key, hours)}
              disabled={saving}
              isToday={day.key === currentDay}
              className={cn(
                day.key === currentDay && 'order-first md:order-none'
              )}
            />
          );
        })}
      </div>

      {/* Save/Cancel Buttons */}
      {hasUnsavedChanges && (
        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-amber-800 dark:text-amber-200">
                Sie haben ungespeicherte Änderungen
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Abbrechen
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Speichert...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Speichern
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// =====================================================================================
// EXPORT
// =====================================================================================

export default WeeklyEditor;