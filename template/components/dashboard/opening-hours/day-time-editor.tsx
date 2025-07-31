/**
 * 🕒 DAY TIME EDITOR COMPONENT
 * Atomic component for editing opening hours of a single day
 * 
 * Features:
 * - Open/Closed toggle with visual feedback
 * - Time input validation (HH:MM format)
 * - Real-time validation with error messages
 * - Disabled state during save operations
 * - Accessible design with proper labels
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DayHours } from '@/lib/restaurant/actions/opening-hours';

// =====================================================================================
// TYPES & INTERFACES
// =====================================================================================

export interface DayTimeEditorProps {
  /** Display name for the day (e.g., "Montag", "Dienstag") */
  dayName: string;
  
  /** Current hours configuration for this day */
  hours: DayHours;
  
  /** Callback when hours are updated */
  onUpdate: (hours: DayHours) => void;
  
  /** Whether the component is disabled (during save operations) */
  disabled?: boolean;
  
  /** Error message to display */
  error?: string | null;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Whether this day is today (for highlighting) */
  isToday?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// =====================================================================================
// VALIDATION HELPERS  
// =====================================================================================

/**
 * Validate time format (HH:MM or HH:MM:SS in 24h format)
 */
function validateTimeFormat(time: string): boolean {
  if (!time || !time.trim()) return false;
  const trimmedTime = time.trim();
  // Allow H:MM, HH:MM, and HH:MM:SS formats (database stores with seconds)
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(trimmedTime);
}

/**
 * Normalize time format to HH:MM
 */
function normalizeTimeFormat(time: string | null): string | null {
  if (!time) return null;
  
  const trimmedTime = time.trim();
  if (!trimmedTime) return null;
  
  // If in HH:MM:SS format (from database), strip seconds
  if (/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(trimmedTime)) {
    return trimmedTime.substring(0, 5); // "11:00:00" -> "11:00"
  }
  
  // If in H:MM:SS format, pad with zero and strip seconds
  if (/^[0-9]:[0-9]{2}:[0-9]{2}$/.test(trimmedTime)) {
    return `0${trimmedTime.substring(0, 4)}`; // "9:00:00" -> "09:00"
  }
  
  // If already in HH:MM format, return as is
  if (/^[0-9]{2}:[0-9]{2}$/.test(trimmedTime)) {
    return trimmedTime;
  }
  
  // If in H:MM format, pad with zero
  if (/^[0-9]:[0-9]{2}$/.test(trimmedTime)) {
    return `0${trimmedTime}`;
  }
  
  return trimmedTime;
}

/**
 * Validate complete day hours configuration
 */
function validateDayHours(hours: DayHours): ValidationResult {
  // If closed, no validation needed
  if (!hours.isOpen) {
    return { isValid: true };
  }

  // If open, both times are required
  if (!hours.openTime || !hours.closeTime) {
    return { 
      isValid: false, 
      error: 'Öffnungs- und Schließzeit sind erforderlich' 
    };
  }

  // Normalize times for validation
  const normalizedOpenTime = normalizeTimeFormat(hours.openTime);
  const normalizedCloseTime = normalizeTimeFormat(hours.closeTime);

  // Validate time formats using normalized times
  if (!normalizedOpenTime || !validateTimeFormat(normalizedOpenTime)) {
    return { 
      isValid: false, 
      error: 'Ungültiges Öffnungszeit-Format (HH:MM)' 
    };
  }

  if (!normalizedCloseTime || !validateTimeFormat(normalizedCloseTime)) {
    return { 
      isValid: false, 
      error: 'Ungültiges Schließzeit-Format (HH:MM)' 
    };
  }

  // Validate logical order (open < close) using normalized times
  if (normalizedOpenTime >= normalizedCloseTime) {
    return { 
      isValid: false, 
      error: 'Öffnungszeit muss vor Schließzeit liegen' 
    };
  }

  return { isValid: true };
}

/**
 * Format time for display (ensure HH:MM format)
 */
function formatTimeForDisplay(time: string | null): string {
  if (!time) return '';
  
  // If already in HH:MM format, return as is
  if (/^[0-9]{2}:[0-9]{2}$/.test(time)) {
    return time;
  }
  
  // If in H:MM format, pad with zero
  if (/^[0-9]:[0-9]{2}$/.test(time)) {
    return `0${time}`;
  }
  
  return time;
}

// =====================================================================================
// DAY TIME EDITOR COMPONENT
// =====================================================================================

export function DayTimeEditor({
  dayName,
  hours,
  onUpdate,
  disabled = false,
  error = null,
  className,
  isToday = false
}: DayTimeEditorProps) {
  // Local state for form inputs (controlled inputs)
  const [localOpenTime, setLocalOpenTime] = useState(hours.openTime || '');
  const [localCloseTime, setLocalCloseTime] = useState(hours.closeTime || '');
  const [localValidation, setLocalValidation] = useState<ValidationResult>({ isValid: true });

  // Sync local state when props change
  useEffect(() => {
    setLocalOpenTime(hours.openTime || '');
    setLocalCloseTime(hours.closeTime || '');
  }, [hours.openTime, hours.closeTime]);

  // Validate and update parent when local state changes
  const updateParent = useCallback((newHours: DayHours) => {
    const validation = validateDayHours(newHours);
    setLocalValidation(validation);
    
    // Always update parent - parent decides when to save (Draft mode)
    onUpdate(newHours);
  }, [onUpdate]);

  // Handle open/closed toggle
  const handleToggle = useCallback(() => {
    const newIsOpen = !hours.isOpen;
    const newHours: DayHours = {
      isOpen: newIsOpen,
      openTime: newIsOpen ? normalizeTimeFormat(localOpenTime || '11:00') : null,
      closeTime: newIsOpen ? normalizeTimeFormat(localCloseTime || '22:00') : null,
      notes: hours.notes
    };
    
    updateParent(newHours);
  }, [hours.isOpen, hours.notes, localOpenTime, localCloseTime, updateParent]);

  // Handle open time change
  const handleOpenTimeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setLocalOpenTime(newTime);
    
    if (hours.isOpen) {
      updateParent({
        ...hours,
        openTime: normalizeTimeFormat(newTime)
      });
    }
  }, [hours, updateParent]);

  // Handle close time change
  const handleCloseTimeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setLocalCloseTime(newTime);
    
    if (hours.isOpen) {
      updateParent({
        ...hours,
        closeTime: normalizeTimeFormat(newTime)
      });
    }
  }, [hours, updateParent]);

  // Handle time input blur (format validation)
  const handleTimeBlur = useCallback((
    event: React.FocusEvent<HTMLInputElement>,
    type: 'open' | 'close'
  ) => {
    const value = event.target.value.trim();
    if (!value) return;

    // Normalize the time format
    const normalizedTime = normalizeTimeFormat(value);
    if (!normalizedTime) return;

    // Update local state if formatting changed
    if (normalizedTime !== value) {
      if (type === 'open') {
        setLocalOpenTime(normalizedTime);
        if (hours.isOpen) {
          updateParent({ ...hours, openTime: normalizedTime });
        }
      } else {
        setLocalCloseTime(normalizedTime);
        if (hours.isOpen) {
          updateParent({ ...hours, closeTime: normalizedTime });  
        }
      }
    }
  }, [hours, updateParent]);

  // Determine error message to display
  const displayError = error || (localValidation.isValid ? null : localValidation.error);

  return (
    <Card className={cn(
      'transition-all duration-200',
      isToday && 'ring-2 ring-primary/20 border-primary/30',
      displayError && 'border-destructive/50',
      disabled && 'opacity-75',
      className
    )}>
      <CardContent className="p-4">
        {/* Day Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label className={cn(
              'text-sm font-medium',
              isToday && 'text-primary'
            )}>
              {dayName}
              {isToday && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Heute
                </Badge>
              )}
            </Label>
          </div>
          
          {/* Status Badge */}
          <Badge 
            variant={hours.isOpen ? 'default' : 'secondary'}
            className={cn(
              'text-xs',
              hours.isOpen ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'
            )}
          >
            {hours.isOpen ? 'Geöffnet' : 'Geschlossen'}
          </Badge>
        </div>

        {/* Open/Closed Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            type="button"
            variant={hours.isOpen ? "default" : "outline"}
            size="sm"
            onClick={handleToggle}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            {hours.isOpen ? (
              <>
                <Check className="h-3 w-3" />
                Geöffnet
              </>
            ) : (
              <>
                <X className="h-3 w-3" />
                Geschlossen
              </>
            )}
          </Button>
        </div>

        {/* Time Inputs (only when open) */}
        {hours.isOpen && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Opening Time */}
              <div className="space-y-1">
                <Label htmlFor={`open-${dayName}`} className="text-xs text-muted-foreground">
                  Öffnung
                </Label>
                <Input
                  id={`open-${dayName}`}
                  type="time"
                  value={formatTimeForDisplay(localOpenTime)}
                  onChange={handleOpenTimeChange}
                  onBlur={(e) => handleTimeBlur(e, 'open')}
                  disabled={disabled}
                  className={cn(
                    'text-sm',
                    displayError && 'border-destructive focus-visible:border-destructive'
                  )}
                  placeholder="11:00"
                />
              </div>

              {/* Closing Time */}
              <div className="space-y-1">
                <Label htmlFor={`close-${dayName}`} className="text-xs text-muted-foreground">
                  Schließung
                </Label>
                <Input
                  id={`close-${dayName}`}
                  type="time"
                  value={formatTimeForDisplay(localCloseTime)}
                  onChange={handleCloseTimeChange}
                  onBlur={(e) => handleTimeBlur(e, 'close')}
                  disabled={disabled}
                  className={cn(
                    'text-sm',
                    displayError && 'border-destructive focus-visible:border-destructive'
                  )}
                  placeholder="22:00"
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {displayError && (
          <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-3 w-3 shrink-0" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Time Display (when closed or valid) */}
        {!displayError && (
          <div className="mt-3 text-xs text-muted-foreground">
            {hours.isOpen ? (
              hours.openTime && hours.closeTime ? (
                `${formatTimeForDisplay(hours.openTime)} - ${formatTimeForDisplay(hours.closeTime)}`
              ) : (
                'Zeiten eingeben...'
              )
            ) : (
              'Geschlossen'
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =====================================================================================
// EXPORT
// =====================================================================================

export default DayTimeEditor;