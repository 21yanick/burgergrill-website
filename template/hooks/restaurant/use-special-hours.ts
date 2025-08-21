/**
 * 🏖️ SPECIAL HOURS HOOK  
 * Clean client-side hook for dashboard special hours (holidays/vacations) management
 * 
 * ARCHITECTURE:
 * - KISS: Simple wrapper around server actions
 * - Clean: Direct server action calls, no complex state management  
 * - Single Responsibility: Only special hours/holidays
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getActiveSpecialHours,
  getAllSpecialHours,
  createSpecialPeriod,
  updateSpecialPeriod,
  deleteSpecialPeriod,
  createCommonHoliday,
} from '@/lib/restaurant/actions/special-hours';
import type { SpecialHours, CreateSpecialHoursData, UpdateSpecialHoursData } from '@/types/database';

// =====================================================================================
// HOOK STATE TYPES  
// =====================================================================================

interface UseSpecialHoursState {
  specialHours: SpecialHours[];
  activeHoliday: SpecialHours | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

interface UseSpecialHoursReturn extends UseSpecialHoursState {
  // Data actions
  refreshSpecialHours: () => Promise<void>;
  
  // CRUD actions
  createPeriod: (data: CreateSpecialHoursData) => Promise<string>;
  updatePeriod: (id: string, data: UpdateSpecialHoursData) => Promise<void>;
  deletePeriod: (id: string) => Promise<void>;
  
  // Convenience actions
  createHoliday: (type: 'christmas' | 'newyear' | 'easter' | 'summer', year?: number) => Promise<string>;
  
  // Utility actions
  clearError: () => void;
}

// =====================================================================================
// SPECIAL HOURS HOOK
// =====================================================================================

export function useSpecialHours(): UseSpecialHoursReturn {
  const [state, setState] = useState<UseSpecialHoursState>({
    specialHours: [],
    activeHoliday: null,
    loading: true,
    saving: false,
    error: null,
  });

  // Clear error state
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load special hours from server
  const refreshSpecialHours = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const [allHours, activeHoliday] = await Promise.all([
        getAllSpecialHours(),
        getActiveSpecialHours(),
      ]);
      
      setState(prev => ({
        ...prev,
        specialHours: allHours,
        activeHoliday,
        loading: false,
      }));
    } catch (error) {
      console.error('[useSpecialHours] Load error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load special hours',
      }));
    }
  }, []);

  // Create new special period
  const createPeriod = useCallback(async (data: CreateSpecialHoursData): Promise<string> => {
    setState(prev => ({ ...prev, saving: true, error: null }));
    
    try {
      const id = await createSpecialPeriod(data);
      
      // Refresh data to get the new period
      await refreshSpecialHours();
      
      setState(prev => ({ ...prev, saving: false }));
      return id;
    } catch (error) {
      console.error('[useSpecialHours] Create error:', error);
      setState(prev => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to create special period',
      }));
      throw error;
    }
  }, [refreshSpecialHours]);

  // Update existing special period
  const updatePeriod = useCallback(async (id: string, data: UpdateSpecialHoursData) => {
    setState(prev => ({ ...prev, saving: true, error: null }));
    
    try {
      await updateSpecialPeriod(id, data);
      
      // Update local state optimistically
      setState(prev => ({
        ...prev,
        specialHours: prev.specialHours.map(period => 
          period.id === id 
            ? { ...period, ...data, updated_at: new Date().toISOString() }
            : period
        ),
        saving: false,
      }));
    } catch (error) {
      console.error('[useSpecialHours] Update error:', error);
      setState(prev => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to update special period',
      }));
      throw error;
    }
  }, []);

  // Delete special period
  const deletePeriod = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, saving: true, error: null }));
    
    try {
      await deleteSpecialPeriod(id);
      
      // Update local state optimistically
      setState(prev => ({
        ...prev,
        specialHours: prev.specialHours.filter(period => period.id !== id),
        activeHoliday: prev.activeHoliday?.id === id ? null : prev.activeHoliday,
        saving: false,
      }));
    } catch (error) {
      console.error('[useSpecialHours] Delete error:', error);
      setState(prev => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to delete special period',
      }));
      throw error;
    }
  }, []);

  // Create common holiday shortcut
  const createHoliday = useCallback(async (
    type: 'christmas' | 'newyear' | 'easter' | 'summer', 
    year?: number
  ): Promise<string> => {
    setState(prev => ({ ...prev, saving: true, error: null }));
    
    try {
      const id = await createCommonHoliday(type, year);
      
      // Refresh data to get the new holiday
      await refreshSpecialHours();
      
      setState(prev => ({ ...prev, saving: false }));
      return id;
    } catch (error) {
      console.error('[useSpecialHours] Holiday create error:', error);
      setState(prev => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to create holiday period',
      }));
      throw error;
    }
  }, [refreshSpecialHours]);

  // Load data on mount
  useEffect(() => {
    refreshSpecialHours();
  }, [refreshSpecialHours]);

  return {
    // State
    specialHours: state.specialHours,
    activeHoliday: state.activeHoliday,
    loading: state.loading,
    saving: state.saving,
    error: state.error,
    
    // Actions
    refreshSpecialHours,
    createPeriod,
    updatePeriod,
    deletePeriod,
    createHoliday,
    clearError,
  };
}

// =====================================================================================
// DASHBOARD-SPECIFIC SPECIAL HOURS HOOK (Alias for backward compatibility)
// =====================================================================================

export const useSpecialHoursDashboard = useSpecialHours;