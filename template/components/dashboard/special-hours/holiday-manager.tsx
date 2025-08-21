/**
 * 🏖️ SIMPLE HOLIDAY MANAGER
 * KISS-principle: Restaurant owner can mark closed periods with a message
 * 
 * What restaurants ACTUALLY need:
 * "We're closed from July 15 to July 25 - Summer vacation!"
 * 
 * Features:
 * - 2 date inputs + 1 message input = DONE
 * - Simple list of holidays
 * - Edit/Delete functionality
 * - Website banner integration
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  AlertCircle,
  Loader2,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpecialHoursDashboard } from '@/hooks/restaurant/use-special-hours';
import type { SpecialHours } from '@/types/database';

// =====================================================================================
// TYPES (SIMPLIFIED)
// =====================================================================================

interface HolidayFormData {
  startDate: string;
  endDate: string;
  message: string;
}

interface HolidayManagerProps {
  className?: string;
}

// =====================================================================================
// HELPER FUNCTIONS
// =====================================================================================

function formatDateForDisplay(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

function getTomorrowString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function isHolidayActive(holiday: SpecialHours): boolean {
  const today = new Date().toISOString().split('T')[0];
  return today >= holiday.date_start && today <= holiday.date_end;
}

function isHolidayUpcoming(holiday: SpecialHours): boolean {
  const today = new Date().toISOString().split('T')[0];
  return holiday.date_start > today;
}

// =====================================================================================
// HOLIDAY FORM COMPONENT
// =====================================================================================

interface HolidayFormProps {
  onSubmit: (data: HolidayFormData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  editingHoliday?: SpecialHours | null;
  onCancel?: () => void;
}

function HolidayForm({ onSubmit, loading = false, error = null, editingHoliday = null, onCancel }: HolidayFormProps) {
  const [formData, setFormData] = useState<HolidayFormData>(() => ({
    startDate: editingHoliday?.date_start || getTomorrowString(),
    endDate: editingHoliday?.date_end || getTomorrowString(),
    message: editingHoliday?.custom_message || 'Wir sind geschlossen - vielen Dank für Ihr Verständnis!'
  }));

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate || !formData.message.trim()) {
      return;
    }

    await onSubmit(formData);
  }, [formData, onSubmit]);

  const isValid = formData.startDate && formData.endDate && formData.message.trim() && 
                  formData.startDate <= formData.endDate;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          {editingHoliday ? 'Ferien/Feiertag bearbeiten' : 'Ferien/Feiertag hinzufügen'}
        </CardTitle>
        <CardDescription>
          Markieren Sie Zeiträume als geschlossen mit einer Nachricht für Ihre Kunden
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Von (Startdatum)</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                disabled={loading}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Bis (Enddatum)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                disabled={loading}
                min={formData.startDate}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Nachricht für Kunden</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="z.B. Wir sind in den Sommerferien. Wir freuen uns Sie ab dem 1. August wieder zu bedienen!"
              disabled={loading}
              maxLength={200}
              className="min-h-20"
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.message.length}/200 Zeichen
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                <X className="w-4 h-4 mr-2" />
                Abbrechen
              </Button>
            )}
            
            <Button type="submit" disabled={!isValid || loading} className="ml-auto">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingHoliday ? 'Wird gespeichert...' : 'Wird hinzugefügt...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingHoliday ? 'Änderungen speichern' : 'Hinzufügen'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// =====================================================================================
// MAIN COMPONENT
// =====================================================================================

export function HolidayManager({ className }: HolidayManagerProps) {
  const {
    specialHours,
    loading,
    error,
    saving,
    createPeriod,
    updatePeriod,
    deletePeriod,
    refreshSpecialHours
  } = useSpecialHoursDashboard();

  const [editingHoliday, setEditingHoliday] = useState<SpecialHours | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);

  // Handle create/update
  const handleSubmit = useCallback(async (data: HolidayFormData) => {
    try {
      if (editingHoliday) {
        // Update existing
        await updatePeriod(editingHoliday.id, {
          date_start: data.startDate,
          date_end: data.endDate,
          is_closed: true, // Always closed for holidays
          reason: 'Ferien', // Simple default
          custom_message: data.message,
          show_banner: true,
          banner_priority: 5
        });
      } else {
        // Create new
        await createPeriod({
          date_start: data.startDate,
          date_end: data.endDate,
          is_closed: true, // Always closed for holidays
          reason: 'Ferien', // Simple default
          custom_message: data.message,
          show_banner: true,
          banner_priority: 5
        });
      }
      
      setEditingHoliday(null);
    } catch (err) {
      console.error('Failed to save holiday:', err);
    }
  }, [editingHoliday, updatePeriod, createPeriod]);

  // Handle delete
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deletePeriod(id);
      setShowDeleteDialog(null);
    } catch (err) {
      console.error('Failed to delete holiday:', err);
    }
  }, [deletePeriod]);

  // Organize holidays
  const activeHolidays = specialHours.filter(isHolidayActive);
  const upcomingHolidays = specialHours.filter(isHolidayUpcoming);
  const pastHolidays = specialHours.filter(h => !isHolidayActive(h) && !isHolidayUpcoming(h));

  return (
    <div className={cn('space-y-6', className)}>
      {/* Form */}
      <HolidayForm
        onSubmit={handleSubmit}
        loading={saving}
        error={error}
        editingHoliday={editingHoliday}
        onCancel={editingHoliday ? () => setEditingHoliday(null) : undefined}
      />

      {/* Holiday List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-primary" />
            Geplante Ferien & Feiertage
            <Badge variant="outline">{specialHours.length}</Badge>
          </CardTitle>
          <CardDescription>
            Übersicht aller geplanten Schliessungen
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          ) : specialHours.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Keine Feiertage geplant</h3>
              <p className="text-sm">Fügen Sie Ihre ersten Ferien oder Feiertage hinzu.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active */}
              {activeHolidays.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    Aktuell aktiv
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 dark:border-emerald-400/30">
                      {activeHolidays.length}
                    </Badge>
                  </h3>
                  {activeHolidays.map((holiday) => (
                    <div key={holiday.id} className="p-4 rounded-lg border-2 border-emerald-500/20 bg-emerald-500/10 dark:border-emerald-400/30 dark:bg-emerald-400/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 dark:border-emerald-400/30">
                              Läuft gerade
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatDateForDisplay(holiday.date_start)}
                              {holiday.date_start !== holiday.date_end && 
                                ` - ${formatDateForDisplay(holiday.date_end)}`}
                            </span>
                          </div>
                          <p className="text-sm font-medium">
                            "{holiday.custom_message}"
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingHoliday(holiday)}
                            disabled={saving}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDeleteDialog(holiday.id)}
                            disabled={saving}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upcoming */}
              {upcomingHolidays.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    Geplant
                    <Badge variant="outline">{upcomingHolidays.length}</Badge>
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {upcomingHolidays.map((holiday) => (
                      <div key={holiday.id} className="p-4 rounded-lg border">
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-sm text-muted-foreground">
                            {formatDateForDisplay(holiday.date_start)}
                            {holiday.date_start !== holiday.date_end && 
                              ` - ${formatDateForDisplay(holiday.date_end)}`}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingHoliday(holiday)}
                              disabled={saving}
                              className="h-8 w-8 p-0"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowDeleteDialog(holiday.id)}
                              disabled={saving}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm">"{holiday.custom_message}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past */}
              {pastHolidays.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                    Vergangen
                    <Badge variant="outline" className="text-muted-foreground">
                      {pastHolidays.slice(0, 5).length}
                    </Badge>
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 opacity-60">
                    {pastHolidays.slice(0, 5).map((holiday) => (
                      <div key={holiday.id} className="p-3 rounded-lg border text-sm">
                        <div className="text-muted-foreground mb-1">
                          {formatDateForDisplay(holiday.date_start)}
                          {holiday.date_start !== holiday.date_end && 
                            ` - ${formatDateForDisplay(holiday.date_end)}`}
                        </div>
                        <p className="text-xs">"{holiday.custom_message}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feiertag löschen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie diese Schliessung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
              Abbrechen
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => showDeleteDialog && handleDelete(showDeleteDialog)}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird gelöscht...
                </>
              ) : (
                'Löschen'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HolidayManager;