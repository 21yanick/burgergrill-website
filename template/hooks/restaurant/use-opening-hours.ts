/**
 * 🕒 OPENING HOURS REACT HOOKS
 * Client-side state management for restaurant opening hours
 * 
 * Features:
 * - Real-time data synchronization with Supabase
 * - Optimistic updates for instant UI feedback
 * - Error handling with user-friendly messages
 * - Loading states for smooth UX
 * - Automatic cache invalidation
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  getOpeningHours,
  updateOpeningHours,
  updateMultipleOpeningHours,
  getRestaurantStatus,
  getRestaurantSettings
} from '@/lib/restaurant/actions/opening-hours';
import type { 
  WeeklyHoursData, 
  RestaurantStatus, 
  RestaurantSettings,
  DayHours,
  UpdateOpeningHoursData 
} from '@/types/database';

// =====================================================================================
// TYPES
// =====================================================================================

export interface UseOpeningHoursReturn {
  // Data
  weeklyHours: WeeklyHoursData | null;
  restaurantSettings: RestaurantSettings | null;
  
  // States
  loading: boolean;
  error: string | null;
  saving: boolean;
  
  // Actions
  updateDay: (dayOfWeek: number, hours: DayHours) => Promise<void>;
  updateMultipleDays: (updates: Array<{ dayOfWeek: number; hours: DayHours }>) => Promise<void>;
  refresh: () => Promise<void>;
  
  // Helpers
  getDayHours: (dayOfWeek: number) => DayHours | null;
  isOpen: (dayOfWeek: number) => boolean;
}

export interface UseRestaurantStatusReturn {
  // Data
  status: RestaurantStatus | null;
  
  // States  
  loading: boolean;
  error: string | null;
  
  // Actions
  refresh: () => Promise<void>;
}

// =====================================================================================
// OPENING HOURS HOOK
// =====================================================================================

/**
 * Hook for managing restaurant opening hours
 * Provides real-time data sync and optimistic updates
 */
export function useOpeningHours(): UseOpeningHoursReturn {
  // State management
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHoursData | null>(null);
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Refs for cleanup and optimization
  const subscriptionRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  // Helper to get day hours by index
  const getDayHours = useCallback((dayOfWeek: number): DayHours | null => {
    if (!weeklyHours) return null;
    
    const dayNames: (keyof WeeklyHoursData)[] = [
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    ];
    
    const dayName = dayNames[dayOfWeek];
    return dayName ? weeklyHours[dayName] : null;
  }, [weeklyHours]);

  // Helper to check if restaurant is open on specific day
  const isOpen = useCallback((dayOfWeek: number): boolean => {
    const dayHours = getDayHours(dayOfWeek);
    return dayHours?.isOpen ?? false;
  }, [getDayHours]);

  // Initial data fetch
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch restaurant settings and opening hours in parallel
      const [settings, hours] = await Promise.all([
        getRestaurantSettings(),
        getOpeningHours()
      ]);
      
      setRestaurantSettings(settings);
      setWeeklyHours(hours);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load opening hours';
      setError(errorMessage);
      console.error('[Opening Hours Hook] Fetch error:', err);
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
    if (!restaurantSettings?.id) return;

    const supabase = createClient();
    
    // Clean up existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Create new subscription for opening hours changes
    subscriptionRef.current = supabase
      .channel('opening-hours-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'opening_hours',
        filter: `restaurant_id=eq.${restaurantSettings.id}`
      }, (payload) => {
        console.log('[Opening Hours Hook] Real-time update:', payload);
        
        // Refresh data when changes occur
        // Note: In production, we could be more granular and just update the changed day
        fetchData();
      })
      .subscribe((status, err) => {
        if (err) {
          console.error('[Opening Hours Hook] Subscription error:', err);
        } else {
          console.log('[Opening Hours Hook] Subscription status:', status);
        }
      });

  }, [restaurantSettings?.id, fetchData]);

  // Update single day with optimistic updates
  const updateDay = useCallback(async (dayOfWeek: number, hours: DayHours) => {
    if (!restaurantSettings?.id || !weeklyHours) {
      throw new Error('Restaurant settings not loaded');
    }

    setSaving(true);
    setError(null);

    // Optimistic update - immediately update UI
    const dayNames: (keyof WeeklyHoursData)[] = [
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    ];
    
    const dayName = dayNames[dayOfWeek];
    if (!dayName) {
      setSaving(false);
      throw new Error('Invalid day of week');
    }

    const previousHours = { ...weeklyHours };
    const optimisticHours = {
      ...weeklyHours,
      [dayName]: hours
    };
    
    setWeeklyHours(optimisticHours);

    try {
      // Server update
      await updateOpeningHours({
        restaurantId: restaurantSettings.id,
        dayOfWeek,
        hours
      });

      console.log(`[Opening Hours Hook] Successfully updated ${dayName}`);
    } catch (err) {
      // Rollback on error
      setWeeklyHours(previousHours);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to update opening hours';
      setError(errorMessage);
      console.error('[Opening Hours Hook] Update error:', err);
      
      throw err;
    } finally {
      setSaving(false);
    }
  }, [restaurantSettings?.id, weeklyHours]);

  // Update multiple days for batch operations
  const updateMultipleDays = useCallback(async (
    updates: Array<{ dayOfWeek: number; hours: DayHours }>
  ) => {
    if (!restaurantSettings?.id || !weeklyHours) {
      throw new Error('Restaurant settings not loaded');
    }

    setSaving(true);
    setError(null);

    try {
      // Server batch update
      await updateMultipleOpeningHours(restaurantSettings.id, updates);

      console.log(`[Opening Hours Hook] Successfully updated ${updates.length} days`);
      
      // Refresh data after successful save (no optimistic updates in draft mode)
      await fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update opening hours';
      setError(errorMessage);
      console.error('[Opening Hours Hook] Batch update error:', err);
      
      throw err;
    } finally {
      setSaving(false);
    }
  }, [restaurantSettings?.id, weeklyHours]);

  // Initialize and setup subscriptions
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      fetchData();
    }
  }, [fetchData]);

  // Setup subscription when restaurant settings are available
  useEffect(() => {
    if (restaurantSettings?.id) {
      setupSubscription();
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [setupSubscription]);

  return {
    // Data
    weeklyHours,
    restaurantSettings,
    
    // States
    loading,
    error,
    saving,
    
    // Actions
    updateDay,
    updateMultipleDays,
    refresh,
    
    // Helpers
    getDayHours,
    isOpen
  };
}

// =====================================================================================
// RESTAURANT STATUS HOOK
// =====================================================================================

/**
 * Hook for getting current restaurant status (open/closed)
 * Auto-refreshes every minute for live status
 */
export function useRestaurantStatus(): UseRestaurantStatusReturn {
  const [status, setStatus] = useState<RestaurantStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Fetch current status
  const fetchStatus = useCallback(async () => {
    try {
      setError(null);
      const currentStatus = await getRestaurantStatus();
      setStatus(currentStatus);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get restaurant status';
      setError(errorMessage);
      console.error('[Restaurant Status Hook] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Manual refresh
  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchStatus();
  }, [fetchStatus]);

  // Auto-refresh setup
  const setupAutoRefresh = useCallback(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up auto-refresh every minute
    intervalRef.current = setInterval(() => {
      fetchStatus();
    }, 60000); // 60 seconds

    console.log('[Restaurant Status Hook] Auto-refresh setup (60s interval)');
  }, [fetchStatus]);

  // Initialize
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      fetchStatus();
      setupAutoRefresh();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStatus, setupAutoRefresh]);

  return {
    status,
    loading,
    error,
    refresh
  };
}

// =====================================================================================
// COMBINED HOOK (for dashboard convenience)
// =====================================================================================

/**
 * Combined hook for dashboard components that need both opening hours and status
 * More efficient than using hooks separately
 */
export function useRestaurantDashboard() {
  const openingHours = useOpeningHours();
  const status = useRestaurantStatus();

  return {
    openingHours,
    status,
    
    // Combined loading state
    loading: openingHours.loading || status.loading,
    
    // Combined error state (prioritize opening hours errors)
    error: openingHours.error || status.error,
    
    // Check if both are ready
    isReady: !openingHours.loading && !status.loading && 
             openingHours.weeklyHours !== null && 
             openingHours.restaurantSettings !== null
  };
}