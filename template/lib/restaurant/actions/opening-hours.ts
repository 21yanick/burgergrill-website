/**
 * 🕒 OPENING HOURS SERVER ACTIONS
 * Clean server-side operations for restaurant opening hours management
 * 
 * Architecture:
 * - Type-safe database operations with Supabase
 * - Proper error handling and validation
 * - Restaurant-specific business logic
 * - Next.js Server Actions for dashboard integration
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import type { 
  Database, 
  OpeningHours, 
  WeeklyHoursData, 
  RestaurantStatus,
  RestaurantSettings 
} from '@/types/database';

// =====================================================================================
// TYPES & VALIDATION
// =====================================================================================

export interface DayHours {
  isOpen: boolean;
  openTime: string | null;  // Format: "HH:MM" (24h)
  closeTime: string | null; // Format: "HH:MM" (24h)
  notes?: string | null;
}

export interface UpdateOpeningHoursData {
  restaurantId: string;
  dayOfWeek: number; // 0=Monday, 6=Sunday
  hours: DayHours;
}

// Input validation helper
function validateTimeFormat(time: string | null): boolean {
  if (!time) return true; // null is valid (closed day)
  
  // Trim whitespace and normalize
  const trimmedTime = time.trim();
  if (!trimmedTime) return false;
  
  // Allow H:MM, HH:MM, and HH:MM:SS formats (database stores with seconds)
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(trimmedTime);
}

// Normalize time format (ensure HH:MM)
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
  
  // Return as is if doesn't match expected patterns
  return trimmedTime;
}

function validateDayOfWeek(day: number): boolean {
  return Number.isInteger(day) && day >= 0 && day <= 6;
}

function validateOpeningHours(hours: DayHours): { valid: boolean; error?: string } {
  // If closed, no time validation needed
  if (!hours.isOpen) {
    return { valid: true };
  }

  // If open, must have both open and close times
  if (!hours.openTime || !hours.closeTime) {
    return { valid: false, error: 'Open days must have both open and close times' };
  }

  // Normalize times for validation
  const normalizedOpenTime = normalizeTimeFormat(hours.openTime);
  const normalizedCloseTime = normalizeTimeFormat(hours.closeTime);

  // Validate time formats
  if (!validateTimeFormat(normalizedOpenTime) || !validateTimeFormat(normalizedCloseTime)) {
    return { valid: false, error: 'Invalid time format. Use HH:MM (24h)' };
  }

  // Validate logical time order (open < close) using normalized times
  if (normalizedOpenTime && normalizedCloseTime && normalizedOpenTime >= normalizedCloseTime) {
    return { valid: false, error: 'Opening time must be before closing time' };
  }

  return { valid: true };
}

// =====================================================================================
// RESTAURANT SETTINGS HELPERS
// =====================================================================================

/**
 * Get restaurant settings for authenticated user
 * Creates default settings if none exist
 */
export async function getRestaurantSettings(): Promise<RestaurantSettings> {
  const user = await requireAuth();
  const supabase = await createClient();

  try {
    // First try to get existing settings
    const { data: settings, error } = await supabase
      .from('restaurant_settings')
      .select('*')
      .eq('profile_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('[Restaurant Settings] Database error:', error);
      throw new Error(`Failed to fetch restaurant settings: ${error.message}`);
    }

    // If no settings exist, the trigger should have created them
    // But let's verify and return them
    if (!settings) {
      throw new Error('Restaurant settings not found. Please contact support.');
    }

    return settings;
  } catch (error) {
    console.error('[Restaurant Settings] Error:', error);
    throw error instanceof Error ? error : new Error('Unknown error fetching restaurant settings');
  }
}

// =====================================================================================
// OPENING HOURS OPERATIONS
// =====================================================================================

/**
 * Get weekly opening hours for restaurant
 * Returns structured data for dashboard components
 */
export async function getOpeningHours(): Promise<WeeklyHoursData> {
  const settings = await getRestaurantSettings();
  const supabase = await createClient();

  try {
    const { data: hours, error } = await supabase
      .from('opening_hours')
      .select('*')
      .eq('restaurant_id', settings.id)
      .order('day_of_week');

    if (error) {
      console.error('[Opening Hours] Database error:', error);
      throw new Error(`Failed to fetch opening hours: ${error.message}`);
    }

    // Transform database data to WeeklyHoursData format
    const weeklyData: WeeklyHoursData = {
      monday: { isOpen: false, openTime: null, closeTime: null },
      tuesday: { isOpen: false, openTime: null, closeTime: null },
      wednesday: { isOpen: false, openTime: null, closeTime: null },
      thursday: { isOpen: false, openTime: null, closeTime: null },
      friday: { isOpen: false, openTime: null, closeTime: null },
      saturday: { isOpen: false, openTime: null, closeTime: null },
      sunday: { isOpen: false, openTime: null, closeTime: null },
    };

    const dayNames: (keyof WeeklyHoursData)[] = [
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    ];

    // Map database results to weekly structure
    hours?.forEach((hour) => {
      const dayName = dayNames[hour.day_of_week];
      if (dayName) {
        weeklyData[dayName] = {
          isOpen: !hour.is_closed,
          openTime: normalizeTimeFormat(hour.open_time), // Normalize HH:MM:SS -> HH:MM
          closeTime: normalizeTimeFormat(hour.close_time), // Normalize HH:MM:SS -> HH:MM
          notes: hour.notes,
        };
      }
    });

    return weeklyData;
  } catch (error) {
    console.error('[Opening Hours] Error:', error);
    throw error instanceof Error ? error : new Error('Unknown error fetching opening hours');
  }
}

/**
 * Update opening hours for a specific day
 * Uses upsert pattern for clean updates
 */
export async function updateOpeningHours(data: UpdateOpeningHoursData): Promise<void> {
  // Input validation
  if (!validateDayOfWeek(data.dayOfWeek)) {
    throw new Error('Invalid day of week. Must be 0-6 (Monday-Sunday)');
  }

  const validation = validateOpeningHours(data.hours);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid opening hours data');
  }

  const user = await requireAuth();
  const supabase = await createClient();

  try {
    // Verify restaurant ownership
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurant_settings')
      .select('id')
      .eq('id', data.restaurantId)
      .eq('profile_id', user.id)
      .single();

    if (restaurantError || !restaurant) {
      throw new Error('Restaurant not found or access denied');
    }

    // Normalize and upsert opening hours
    const normalizedOpenTime = data.hours.isOpen ? normalizeTimeFormat(data.hours.openTime) : null;
    const normalizedCloseTime = data.hours.isOpen ? normalizeTimeFormat(data.hours.closeTime) : null;
    
    const { error: upsertError } = await supabase
      .from('opening_hours')
      .upsert({
        restaurant_id: data.restaurantId,
        day_of_week: data.dayOfWeek,
        is_closed: !data.hours.isOpen,
        open_time: normalizedOpenTime,
        close_time: normalizedCloseTime,
        notes: data.hours.notes || null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'restaurant_id,day_of_week'
      });

    if (upsertError) {
      console.error('[Opening Hours] Upsert error:', upsertError);
      throw new Error(`Failed to update opening hours: ${upsertError.message}`);
    }

    // Revalidate dashboard and public pages
    revalidatePath('/dashboard/opening-hours');
    revalidatePath('/'); // Main page with opening hours display
    
    console.log(`[Opening Hours] Successfully updated day ${data.dayOfWeek} for restaurant ${data.restaurantId}`);
  } catch (error) {
    console.error('[Opening Hours] Update error:', error);
    throw error instanceof Error ? error : new Error('Unknown error updating opening hours');
  }
}

/**
 * Get current restaurant status (open/closed)
 * Uses database function for consistent logic
 */
export async function getRestaurantStatus(): Promise<RestaurantStatus> {
  const settings = await getRestaurantSettings();
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .rpc('get_restaurant_status', { 
        restaurant_uuid: settings.id 
      });

    if (error) {
      console.error('[Restaurant Status] RPC error:', error);
      throw new Error(`Failed to get restaurant status: ${error.message}`);
    }

    // The RPC returns an array, get first result
    const status = data?.[0];
    if (!status) {
      throw new Error('No status data returned from database');
    }

    return {
      isOpen: status.is_open,
      currentMessage: status.current_message,
      nextOpening: status.next_opening,
    };
  } catch (error) {
    console.error('[Restaurant Status] Error:', error);
    
    // Fallback: return a safe default status
    return {
      isOpen: false,
      currentMessage: 'Status nicht verfügbar',
      nextOpening: null,
    };
  }
}

// =====================================================================================
// BATCH OPERATIONS (for efficiency)
// =====================================================================================

/**
 * Update multiple days at once
 * More efficient for bulk updates
 */
export async function updateMultipleOpeningHours(
  restaurantId: string,
  updates: Array<{ dayOfWeek: number; hours: DayHours }>
): Promise<void> {
  const user = await requireAuth();
  const supabase = await createClient();

  // Validate all inputs first
  for (const update of updates) {
    if (!validateDayOfWeek(update.dayOfWeek)) {
      throw new Error(`Invalid day of week: ${update.dayOfWeek}`);
    }
    
    const validation = validateOpeningHours(update.hours);
    if (!validation.valid) {
      throw new Error(`Day ${update.dayOfWeek}: ${validation.error}`);
    }
  }

  try {
    // Verify restaurant ownership
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurant_settings')
      .select('id')
      .eq('id', restaurantId)
      .eq('profile_id', user.id)
      .single();

    if (restaurantError || !restaurant) {
      throw new Error('Restaurant not found or access denied');
    }

    // Prepare batch upsert data with normalization
    const upsertData = updates.map(update => ({
      restaurant_id: restaurantId,
      day_of_week: update.dayOfWeek,
      is_closed: !update.hours.isOpen,
      open_time: update.hours.isOpen ? normalizeTimeFormat(update.hours.openTime) : null,
      close_time: update.hours.isOpen ? normalizeTimeFormat(update.hours.closeTime) : null,
      notes: update.hours.notes || null,
      updated_at: new Date().toISOString(),
    }));

    // Batch upsert
    const { error: batchError } = await supabase
      .from('opening_hours')
      .upsert(upsertData, {
        onConflict: 'restaurant_id,day_of_week'
      });

    if (batchError) {
      console.error('[Opening Hours] Batch upsert error:', batchError);
      throw new Error(`Failed to update opening hours: ${batchError.message}`);
    }

    // Revalidate pages
    revalidatePath('/dashboard/opening-hours');
    revalidatePath('/');
    
    console.log(`[Opening Hours] Successfully updated ${updates.length} days for restaurant ${restaurantId}`);
  } catch (error) {
    console.error('[Opening Hours] Batch update error:', error);
    throw error instanceof Error ? error : new Error('Unknown error updating opening hours');
  }
}

// =====================================================================================
// UTILITY FUNCTIONS
// =====================================================================================

/**
 * Generate default opening hours for new restaurants
 * Called by database trigger, but available for manual setup
 */
export async function createDefaultOpeningHours(restaurantId: string): Promise<void> {
  const user = await requireAuth();
  const supabase = await createClient();

  try {
    // Verify restaurant ownership
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurant_settings')
      .select('id')
      .eq('id', restaurantId)
      .eq('profile_id', user.id)
      .single();

    if (restaurantError || !restaurant) {
      throw new Error('Restaurant not found or access denied');
    }

    // Default hours: Mon-Sat 11:00-22:00, Sunday closed
    const defaultHours = [
      { day_of_week: 0, is_closed: false, open_time: '11:00', close_time: '22:00' }, // Monday
      { day_of_week: 1, is_closed: false, open_time: '11:00', close_time: '22:00' }, // Tuesday
      { day_of_week: 2, is_closed: false, open_time: '11:00', close_time: '22:00' }, // Wednesday
      { day_of_week: 3, is_closed: false, open_time: '11:00', close_time: '22:00' }, // Thursday
      { day_of_week: 4, is_closed: false, open_time: '11:00', close_time: '22:00' }, // Friday
      { day_of_week: 5, is_closed: false, open_time: '11:00', close_time: '22:00' }, // Saturday
      { day_of_week: 6, is_closed: true, open_time: null, close_time: null },        // Sunday
    ].map(day => ({
      ...day,
      restaurant_id: restaurantId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Insert default hours
    const { error: insertError } = await supabase
      .from('opening_hours')
      .insert(defaultHours);

    if (insertError) {
      console.error('[Opening Hours] Default creation error:', insertError);
      throw new Error(`Failed to create default opening hours: ${insertError.message}`);
    }

    console.log(`[Opening Hours] Created default hours for restaurant ${restaurantId}`);
  } catch (error) {
    console.error('[Opening Hours] Default creation error:', error);
    throw error instanceof Error ? error : new Error('Unknown error creating default opening hours');
  }
}