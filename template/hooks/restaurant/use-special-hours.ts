/**
 * 📅 SPECIAL HOURS REACT HOOKS
 * Client-side state management for restaurant special hours (holidays, vacations, etc.)
 * 
 * Features:
 * - Real-time data synchronization with Supabase
 * - Optimistic updates for instant UI feedback
 * - Date conflict detection with user-friendly messages
 * - Loading states for smooth UX
 * - Automatic cache invalidation
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  getSpecialHours,
  getActiveSpecialHours,
  getUpcomingSpecialHours,
  createSpecialPeriod,
  updateSpecialPeriod,
  deleteSpecialPeriod,
  checkDateConflicts,
  createCommonHoliday
} from '@/lib/restaurant/actions/special-hours';
import type { 
  SpecialHours,
  SpecialPeriod,
  RestaurantSettings,
  CreateSpecialPeriodData,
  UpdateSpecialPeriodData,
  ConflictCheckResult
} from '@/types/database';

// =====================================================================================
// TYPES
// =====================================================================================

export interface UseSpecialHoursReturn {
  // Data
  specialHours: SpecialHours[];
  activeSpecialHours: SpecialHours | null;
  upcomingSpecialHours: SpecialHours[];
  
  // States
  loading: boolean;
  error: string | null;
  saving: boolean;
  
  // Actions
  createPeriod: (data: CreateSpecialPeriodData) => Promise<string>;
  updatePeriod: (data: UpdateSpecialPeriodData) => Promise<void>;
  deletePeriod: (id: string) => Promise<void>;
  checkConflicts: (startDate: string, endDate: string, excludeId?: string) => Promise<ConflictCheckResult>;
  createHoliday: (holiday: 'christmas' | 'new_year' | 'easter' | 'summer_vacation', year?: number) => Promise<string>;
  refresh: () => Promise<void>;
  
  // Helpers
  getPeriodById: (id: string) => SpecialHours | null;
  isPeriodActive: (period: SpecialHours) => boolean;
  isPeriodUpcoming: (period: SpecialHours) => boolean;
  getPeriodsByReason: (reason: SpecialHours['reason']) => SpecialHours[];
}

export interface UseActiveSpecialHoursReturn {
  // Data
  activeSpecialHours: SpecialHours | null;
  
  // States
  loading: boolean;
  error: string | null;
  
  // Actions
  refresh: () => Promise<void>;
  
  // Helpers
  hasActivePeriod: boolean;
  isCurrentlyClosed: boolean;
  getCurrentMessage: () => string | null;
}

export interface UseSpecialHoursDashboardReturn extends UseSpecialHoursReturn {
  // Additional dashboard-specific state
  selectedPeriod: SpecialHours | null;
  editMode: boolean;
  
  // Dashboard actions
  selectPeriod: (period: SpecialHours | null) => void;
  enterEditMode: (period?: SpecialHours) => void;
  exitEditMode: () => void;
  
  // Quick actions
  createVacation: (startDate: string, endDate: string, message?: string) => Promise<string>;
  createHolidayPeriod: (date: string, reason: string, message?: string) => Promise<string>;
}

// =====================================================================================
// MAIN SPECIAL HOURS HOOK
// =====================================================================================

/**
 * Hook for managing restaurant special hours
 * Provides real-time data sync and optimistic updates
 */
export function useSpecialHours(): UseSpecialHoursReturn {
  // State management
  const [specialHours, setSpecialHours] = useState<SpecialHours[]>([]);
  const [activeSpecialHours, setActiveSpecialHours] = useState<SpecialHours | null>(null);
  const [upcomingSpecialHours, setUpcomingSpecialHours] = useState<SpecialHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Refs for cleanup and optimization
  const subscriptionRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  // Helper functions
  const getPeriodById = useCallback((id: string): SpecialHours | null => {
    return specialHours.find(period => period.id === id) || null;
  }, [specialHours]);

  const isPeriodActive = useCallback((period: SpecialHours): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return today >= period.date_start && today <= period.date_end;
  }, []);

  const isPeriodUpcoming = useCallback((period: SpecialHours): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return period.date_start > today;
  }, []);

  const getPeriodsByReason = useCallback((reason: SpecialHours['reason']): SpecialHours[] => {
    return specialHours.filter(period => period.reason === reason);
  }, [specialHours]);

  // Initial data fetch
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch all special hours data in parallel
      const [allHours, activeHours, upcomingHours] = await Promise.all([
        getSpecialHours(),
        getActiveSpecialHours(),
        getUpcomingSpecialHours()
      ]);
      
      setSpecialHours(allHours);
      setActiveSpecialHours(activeHours);
      setUpcomingSpecialHours(upcomingHours);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load special hours';
      setError(errorMessage);
      console.error('[Special Hours Hook] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data manually
  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchData();
  }, [fetchData]);

  // Setup real-time subscription
  const setupSubscription = useCallback(() => {
    const supabase = createClient();
    
    // Clean up existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Create new subscription for special hours changes
    subscriptionRef.current = supabase
      .channel('special-hours-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'special_hours'
      }, (payload) => {
        console.log('[Special Hours Hook] Real-time update:', payload);
        
        // Refresh data when changes occur
        // Note: In production, we could be more granular and just update the changed period
        fetchData();
      })
      .subscribe((status, err) => {
        if (err) {
          console.error('[Special Hours Hook] Subscription error:', err);
        } else {
          console.log('[Special Hours Hook] Subscription status:', status);
        }
      });

  }, [fetchData]);

  // Create new special period with optimistic updates
  const createPeriod = useCallback(async (data: CreateSpecialPeriodData): Promise<string> => {
    setSaving(true);
    setError(null);

    // Create optimistic period for immediate UI feedback
    const optimisticPeriod: SpecialHours = {
      id: `temp-${Date.now()}`, // Temporary ID
      restaurant_id: 'temp-restaurant-id',
      date_start: data.startDate,
      date_end: data.endDate,
      is_closed: data.isClosed,
      custom_open_time: data.customOpenTime || null,
      custom_close_time: data.customCloseTime || null,
      reason: data.reason,
      custom_message: data.customMessage || null,
      show_banner: data.showBanner ?? true,
      banner_priority: data.priority ?? 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistic update - add period to list
    const previousHours = [...specialHours];
    const optimisticHours = [...specialHours, optimisticPeriod].sort(
      (a, b) => a.date_start.localeCompare(b.date_start)
    );
    setSpecialHours(optimisticHours);

    try {
      // Server create
      const newPeriodId = await createSpecialPeriod(data);
      console.log(`[Special Hours Hook] Successfully created period ${newPeriodId}`);
      
      // Refresh to get the real data with proper IDs
      await fetchData();
      return newPeriodId;
    } catch (err) {
      // Rollback on error
      setSpecialHours(previousHours);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to create special period';
      setError(errorMessage);
      console.error('[Special Hours Hook] Create error:', err);
      
      throw err;
    } finally {
      setSaving(false);
    }
  }, [specialHours, fetchData]);

  // Update existing special period with optimistic updates
  const updatePeriod = useCallback(async (data: UpdateSpecialPeriodData): Promise<void> => {
    setSaving(true);
    setError(null);

    // Find the period to update
    const periodIndex = specialHours.findIndex(p => p.id === data.id);
    if (periodIndex === -1) {
      setSaving(false);
      throw new Error('Period not found');
    }

    // Optimistic update - immediately update UI
    const previousHours = [...specialHours];
    const updatedPeriod: SpecialHours = {
      ...specialHours[periodIndex],
      ...(data.startDate !== undefined && { date_start: data.startDate }),
      ...(data.endDate !== undefined && { date_end: data.endDate }),
      ...(data.isClosed !== undefined && { is_closed: data.isClosed }),
      ...(data.customOpenTime !== undefined && { custom_open_time: data.customOpenTime || null }),
      ...(data.customCloseTime !== undefined && { custom_close_time: data.customCloseTime || null }),
      ...(data.reason !== undefined && { reason: data.reason }),
      ...(data.customMessage !== undefined && { custom_message: data.customMessage || null }),
      ...(data.showBanner !== undefined && { show_banner: data.showBanner }),
      ...(data.priority !== undefined && { banner_priority: data.priority }),
      updated_at: new Date().toISOString(),
    };

    const optimisticHours = [...specialHours];
    optimisticHours[periodIndex] = updatedPeriod;
    optimisticHours.sort((a, b) => a.date_start.localeCompare(b.date_start));
    setSpecialHours(optimisticHours);

    try {
      // Server update
      await updateSpecialPeriod(data);
      console.log(`[Special Hours Hook] Successfully updated period ${data.id}`);
      
      // Refresh to get the latest data
      await fetchData();
    } catch (err) {
      // Rollback on error
      setSpecialHours(previousHours);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to update special period';
      setError(errorMessage);
      console.error('[Special Hours Hook] Update error:', err);
      
      throw err;
    } finally {
      setSaving(false);
    }
  }, [specialHours, fetchData]);

  // Delete special period with optimistic updates
  const deletePeriod = useCallback(async (id: string): Promise<void> => {
    setSaving(true);
    setError(null);

    // Optimistic update - immediately remove from UI
    const previousHours = [...specialHours];
    const optimisticHours = specialHours.filter(period => period.id !== id);
    setSpecialHours(optimisticHours);

    try {
      // Server delete
      await deleteSpecialPeriod(id);
      console.log(`[Special Hours Hook] Successfully deleted period ${id}`);
      
      // Refresh to ensure consistency
      await fetchData();
    } catch (err) {
      // Rollback on error
      setSpecialHours(previousHours);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete special period';
      setError(errorMessage);
      console.error('[Special Hours Hook] Delete error:', err);
      
      throw err;
    } finally {
      setSaving(false);
    }
  }, [specialHours, fetchData]);

  // Check for date conflicts
  const checkConflicts = useCallback(async (
    startDate: string, 
    endDate: string, 
    excludeId?: string
  ): Promise<ConflictCheckResult> => {
    try {
      return await checkDateConflicts(startDate, endDate, excludeId);
    } catch (err) {
      console.error('[Special Hours Hook] Conflict check error:', err);
      // Return safe default - assume no conflicts if check fails
      return { hasConflict: false, conflictingPeriods: [] };
    }
  }, []);

  // Create common holiday with optimistic updates
  const createHoliday = useCallback(async (
    holiday: 'christmas' | 'new_year' | 'easter' | 'summer_vacation',
    year?: number
  ): Promise<string> => {
    setSaving(true);
    setError(null);

    try {
      const newPeriodId = await createCommonHoliday(holiday, year);
      console.log(`[Special Hours Hook] Successfully created ${holiday} holiday`);
      
      // Refresh to get the new data
      await fetchData();
      return newPeriodId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to create ${holiday} holiday`;
      setError(errorMessage);
      console.error('[Special Hours Hook] Holiday create error:', err);
      
      throw err;
    } finally {
      setSaving(false);
    }
  }, [fetchData]);

  // Initialize data and subscription
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      fetchData();
    }
  }, [fetchData]);

  // Setup subscription after initial load
  useEffect(() => {
    if (!loading && specialHours.length >= 0) {
      setupSubscription();
    }

    // Cleanup subscription on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [loading, setupSubscription]);

  return {
    // Data
    specialHours,
    activeSpecialHours,
    upcomingSpecialHours,
    
    // States
    loading,
    error,
    saving,
    
    // Actions
    createPeriod,
    updatePeriod,
    deletePeriod,
    checkConflicts,
    createHoliday,
    refresh,
    
    // Helpers
    getPeriodById,
    isPeriodActive,
    isPeriodUpcoming,
    getPeriodsByReason,
  };
}

// =====================================================================================
// ACTIVE SPECIAL HOURS HOOK (for website integration)
// =====================================================================================

/**
 * Hook for getting current active special hours
 * Lightweight hook for website banner integration
 */
export function useActiveSpecialHours(): UseActiveSpecialHoursReturn {
  const [activeSpecialHours, setActiveSpecialHours] = useState<SpecialHours | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch active special hours
  const fetchActiveHours = useCallback(async () => {
    try {
      setError(null);
      const activeHours = await getActiveSpecialHours();
      setActiveSpecialHours(activeHours);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load active special hours';
      setError(errorMessage);
      console.error('[Active Special Hours Hook] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data manually
  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchActiveHours();
  }, [fetchActiveHours]);

  // Helper functions
  const hasActivePeriod = activeSpecialHours !== null;
  const isCurrentlyClosed = activeSpecialHours?.is_closed ?? false;
  
  const getCurrentMessage = useCallback((): string | null => {
    if (!activeSpecialHours) return null;
    return activeSpecialHours.custom_message || activeSpecialHours.reason;
  }, [activeSpecialHours]);

  // Initialize and setup auto-refresh
  useEffect(() => {
    fetchActiveHours();

    // Auto-refresh every 5 minutes to catch period changes
    const interval = setInterval(fetchActiveHours, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchActiveHours]);

  return {
    // Data
    activeSpecialHours,
    
    // States
    loading,
    error,
    
    // Actions
    refresh,
    
    // Helpers
    hasActivePeriod,
    isCurrentlyClosed,
    getCurrentMessage,
  };
}

// =====================================================================================
// DASHBOARD CONVENIENCE HOOK
// =====================================================================================

/**
 * Combined hook for dashboard usage
 * Includes additional dashboard-specific state and actions
 */
export function useSpecialHoursDashboard(): UseSpecialHoursDashboardReturn {
  const specialHoursHook = useSpecialHours();
  
  // Additional dashboard state
  const [selectedPeriod, setSelectedPeriod] = useState<SpecialHours | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Dashboard actions
  const selectPeriod = useCallback((period: SpecialHours | null) => {
    setSelectedPeriod(period);
    if (!period) {
      setEditMode(false);
    }
  }, []);

  const enterEditMode = useCallback((period?: SpecialHours) => {
    if (period) {
      setSelectedPeriod(period);
    }
    setEditMode(true);
  }, []);

  const exitEditMode = useCallback(() => {
    setEditMode(false);
    setSelectedPeriod(null);
  }, []);

  // Quick action helpers
  const createVacation = useCallback(async (
    startDate: string, 
    endDate: string, 
    message?: string
  ): Promise<string> => {
    return specialHoursHook.createPeriod({
      startDate: startDate,
      endDate: endDate,
      isClosed: true,
      reason: 'Ferien',
      customMessage: message || 'Wir sind in den Ferien. Vielen Dank für Ihr Verständnis!',
      showBanner: true,
      priority: 5
    });
  }, [specialHoursHook.createPeriod]);

  const createHolidayPeriod = useCallback(async (
    date: string, 
    reason: string, 
    message?: string
  ): Promise<string> => {
    return specialHoursHook.createPeriod({
      startDate: date,
      endDate: date, // Single day
      isClosed: true,
      reason: 'Feiertag',
      customMessage: message || `Wir sind wegen ${reason} geschlossen.`,
      showBanner: true,
      priority: 8
    });
  }, [specialHoursHook.createPeriod]);

  return {
    ...specialHoursHook,
    
    // Additional dashboard state
    selectedPeriod,
    editMode,
    
    // Dashboard actions
    selectPeriod,
    enterEditMode,
    exitEditMode,
    
    // Quick actions
    createVacation,
    createHolidayPeriod,
  };
}