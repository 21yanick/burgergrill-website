/**
 * 🕒 OPENING HOURS HOOK
 * Clean client-side hook for dashboard opening hours management
 * 
 * ARCHITECTURE:
 * - KISS: Simple wrapper around server actions
 * - Clean: Direct server action calls, no complex state management
 * - Single Responsibility: Only opening hours, no restaurant settings
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getOpeningHours, 
  updateOpeningHours,
  updateDayHours,
  getRestaurantStatus 
} from '@/lib/restaurant/actions/opening-hours';
import type { WeeklyHours, DayHours, UpdateDayRequest, RestaurantStatus } from '@/types/database';

// =====================================================================================
// HOOK STATE TYPES
// =====================================================================================

interface UseOpeningHoursState {
  weeklyHours: WeeklyHours | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

interface UseOpeningHoursReturn extends UseOpeningHoursState {
  // Data actions
  refreshHours: () => Promise<void>;
  
  // Update actions  
  updateWeeklyHours: (hours: WeeklyHours) => Promise<void>;
  updateSingleDay: (dayOfWeek: number, hours: DayHours) => Promise<void>;
  updateMultipleDays: (updates: UpdateDayRequest[]) => Promise<void>;
  
  // Utility actions
  clearError: () => void;
}

// =====================================================================================
// OPENING HOURS HOOK
// =====================================================================================

export function useOpeningHours(): UseOpeningHoursReturn {
  const [state, setState] = useState<UseOpeningHoursState>({
    weeklyHours: null,
    loading: true,
    saving: false,
    error: null,
  });

  // Clear error state
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load opening hours from server
  const refreshHours = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const hours = await getOpeningHours();
      setState(prev => ({
        ...prev,
        weeklyHours: hours,
        loading: false,
      }));
    } catch (error) {
      console.error('[useOpeningHours] Load error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load opening hours',
      }));
    }
  }, []);

  // Update complete weekly schedule
  const updateWeeklyHours = useCallback(async (hours: WeeklyHours) => {
    setState(prev => ({ ...prev, saving: true, error: null }));
    
    try {
      await updateOpeningHours(hours);
      setState(prev => ({
        ...prev,
        weeklyHours: hours,
        saving: false,
      }));
    } catch (error) {
      console.error('[useOpeningHours] Update error:', error);
      setState(prev => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to update opening hours',
      }));
      throw error; // Re-throw for component error handling
    }
  }, []);

  // Update single day
  const updateSingleDay = useCallback(async (dayOfWeek: number, hours: DayHours) => {
    setState(prev => ({ ...prev, saving: true, error: null }));
    
    try {
      await updateDayHours(dayOfWeek, hours);
      
      // Update local state optimistically
      setState(prev => {
        if (!prev.weeklyHours) return { ...prev, saving: false };
        
        const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
        const dayKey = dayNames[dayOfWeek];
        
        return {
          ...prev,
          weeklyHours: {
            ...prev.weeklyHours,
            [dayKey]: hours,
          },
          saving: false,
        };
      });
    } catch (error) {
      console.error('[useOpeningHours] Day update error:', error);
      setState(prev => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to update day hours',
      }));
      throw error;
    }
  }, []);

  // Update multiple days (batch operation)
  const updateMultipleDays = useCallback(async (updates: UpdateDayRequest[]) => {
    setState(prev => ({ ...prev, saving: true, error: null }));
    
    try {
      // Convert UpdateDayRequest[] to WeeklyHours format
      const currentHours = state.weeklyHours;
      if (!currentHours) {
        throw new Error('No current hours available for batch update');
      }
      
      // Apply updates to current hours
      const updatedHours = { ...currentHours };
      const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
      
      updates.forEach(update => {
        const dayKey = dayNames[update.dayOfWeek];
        if (dayKey) {
          updatedHours[dayKey] = update.hours;
        }
      });
      
      // Send to server
      await updateOpeningHours(updatedHours);
      
      setState(prev => ({
        ...prev,
        weeklyHours: updatedHours,
        saving: false,
      }));
    } catch (error) {
      console.error('[useOpeningHours] Batch update error:', error);
      setState(prev => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to update opening hours',
      }));
      throw error;
    }
  }, [state.weeklyHours]);

  // Load data on mount
  useEffect(() => {
    refreshHours();
  }, [refreshHours]);

  return {
    // State
    weeklyHours: state.weeklyHours,
    loading: state.loading,
    saving: state.saving,
    error: state.error,
    
    // Actions
    refreshHours,
    updateWeeklyHours,
    updateSingleDay, 
    updateMultipleDays,
    clearError,
  };
}

// =====================================================================================
// RESTAURANT STATUS HOOK (Simple wrapper)
// =====================================================================================

export function useRestaurantStatus() {
  const [status, setStatus] = useState<RestaurantStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const restaurantStatus = await getRestaurantStatus();
      setStatus(restaurantStatus);
    } catch (err) {
      console.error('[useRestaurantStatus] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get restaurant status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  return {
    status,
    loading,
    error,
    refreshStatus,
  };
}