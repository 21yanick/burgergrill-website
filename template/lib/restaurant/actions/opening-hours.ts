/**
 * 🍔 SINGLE-TENANT OPENING HOURS SERVER ACTIONS
 * Clean server-side operations for single restaurant opening hours
 * 
 * Architecture:
 * - PUBLIC functions: No auth needed (marketing website)
 * - ADMIN functions: Auth required (dashboard)
 * - Direct table access: No complex restaurant_id relations
 * - Type-safe database operations with Supabase
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

// =====================================================================================
// TYPES (Simplified for Single-Tenant)
// =====================================================================================

export type DayHours = {
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
  notes?: string | null;
};

export type WeeklyHours = {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
};

export type RestaurantInfo = {
  id: string;
  business_name: string;
  phone: string | null;
  email: string | null;
  street: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  google_maps_url: string | null;
  maps_embed_src: string | null;
  created_at: string;
  updated_at: string;
};

export type RestaurantStatus = {
  isOpen: boolean;
  currentDay: string;
  todayHours: DayHours;
  nextChange: string | null;
};

// Display-ready hours for marketing website (KISS principle)
export type DisplayHours = {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};

// =====================================================================================
// VALIDATION HELPERS
// =====================================================================================

function validateTimeFormat(time: string | null): boolean {
  if (!time) return true; // null is valid (closed day)
  
  const trimmedTime = time.trim();
  if (!trimmedTime) return false;
  
  // Allow H:MM, HH:MM, and HH:MM:SS formats
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(trimmedTime);
}

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

function validateDayHours(hours: DayHours): { valid: boolean; error?: string } {
  if (!hours.isOpen) {
    return { valid: true };
  }
  
  if (!hours.openTime || !hours.closeTime) {
    return { valid: false, error: 'Open and close times required when restaurant is open' };
  }
  
  if (!validateTimeFormat(hours.openTime) || !validateTimeFormat(hours.closeTime)) {
    return { valid: false, error: 'Invalid time format. Use HH:MM format' };
  }
  
  if (hours.openTime >= hours.closeTime) {
    return { valid: false, error: 'Open time must be before close time' };
  }
  
  return { valid: true };
}

// =====================================================================================
// PUBLIC FUNCTIONS (No Auth Required - Marketing Website)
// =====================================================================================

/**
 * Get display-ready opening hours strings - PUBLIC ACCESS
 * Used by marketing website for direct display (KISS principle)
 */
export async function getDisplayOpeningHours(): Promise<DisplayHours | null> {
  const supabase = await createClient();
  
  try {
    const { data: hours, error } = await supabase
      .from('opening_hours')
      .select('*')
      .order('day_of_week');

    if (error) {
      console.error('[Display Hours] Database error:', error);
      return null;
    }

    if (!hours || hours.length === 0) {
      console.warn('[Display Hours] No hours found in database');
      return null;
    }

    // Transform database data directly to display strings
    const displayHours = {
      monday: 'Geschlossen',
      tuesday: 'Geschlossen',
      wednesday: 'Geschlossen',
      thursday: 'Geschlossen',
      friday: 'Geschlossen',
      saturday: 'Geschlossen',
      sunday: 'Geschlossen',
    };

    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

    // Convert each database row to display string
    hours.forEach((hour) => {
      const dayName = dayNames[hour.day_of_week];
      if (dayName) {
        if (!hour.is_closed && hour.open_time && hour.close_time) {
          const openTime = normalizeTimeFormat(hour.open_time);
          const closeTime = normalizeTimeFormat(hour.close_time);
          displayHours[dayName] = `${openTime} - ${closeTime}`;
        }
        // If closed or missing times, keep 'Geschlossen'
      }
    });

    return displayHours;
  } catch (error) {
    console.error('[Display Hours] Unexpected error:', error);
    return null;
  }
}

/**
 * Get structured opening hours data - PUBLIC ACCESS
 * Used by dashboard and components that need structured data
 */
export async function getOpeningHours(): Promise<WeeklyHours | null> {
  const supabase = await createClient();
  
  try {
    const { data: hours, error } = await supabase
      .from('opening_hours')
      .select('*')
      .order('day_of_week');

    if (error) {
      console.error('[Opening Hours] Database error:', error);
      return null;
    }

    if (!hours || hours.length === 0) {
      console.warn('[Opening Hours] No hours found in database');
      return null;
    }

    // Transform database data to WeeklyHours format
    const weeklyData: WeeklyHours = {
      monday: { isOpen: false, openTime: null, closeTime: null },
      tuesday: { isOpen: false, openTime: null, closeTime: null },
      wednesday: { isOpen: false, openTime: null, closeTime: null },
      thursday: { isOpen: false, openTime: null, closeTime: null },
      friday: { isOpen: false, openTime: null, closeTime: null },
      saturday: { isOpen: false, openTime: null, closeTime: null },
      sunday: { isOpen: false, openTime: null, closeTime: null },
    };

    const dayNames: (keyof WeeklyHours)[] = [
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    ];

    // Map database results to weekly structure
    hours.forEach((hour) => {
      const dayName = dayNames[hour.day_of_week];
      if (dayName) {
        weeklyData[dayName] = {
          isOpen: !hour.is_closed,
          openTime: normalizeTimeFormat(hour.open_time),
          closeTime: normalizeTimeFormat(hour.close_time),
          notes: hour.notes,
        };
      }
    });

    return weeklyData;
  } catch (error) {
    console.error('[Opening Hours] Unexpected error:', error);
    return null;
  }
}

/**
 * Get restaurant basic info - PUBLIC ACCESS
 * Used by marketing website to display contact info
 */
export async function getRestaurantInfo(): Promise<RestaurantInfo | null> {
  const supabase = await createClient();
  
  try {
    const { data: info, error } = await supabase
      .from('restaurant_info')
      .select('*')
      .single();

    if (error) {
      console.error('[Restaurant Info] Database error:', error);
      return null;
    }

    return info;
  } catch (error) {
    console.error('[Restaurant Info] Unexpected error:', error);
    return null;
  }
}

/**
 * Get current restaurant status - PUBLIC ACCESS
 * Used by marketing website to show if restaurant is currently open
 */
export async function getRestaurantStatus(): Promise<RestaurantStatus | null> {
  const hours = await getOpeningHours();
  if (!hours) return null;

  const now = new Date();
  const dayIndex = (now.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0 format
  const dayNames: (keyof WeeklyHours)[] = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];
  
  const currentDayName = dayNames[dayIndex];
  const todayHours = hours[currentDayName];
  
  let isOpen = false;
  if (todayHours.isOpen && todayHours.openTime && todayHours.closeTime) {
    const currentTime = now.toTimeString().substring(0, 5); // "HH:MM"
    isOpen = currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
  }

  return {
    isOpen,
    currentDay: currentDayName,
    todayHours,
    nextChange: null, // Could be implemented later if needed
  };
}

// =====================================================================================
// ADMIN FUNCTIONS (Auth Required - Dashboard Only)
// =====================================================================================

/**
 * Update weekly opening hours - ADMIN ONLY
 * Used by dashboard to modify restaurant schedule
 */
export async function updateOpeningHours(data: WeeklyHours): Promise<void> {
  await requireAuth(); // Auth required for modifications
  const supabase = await createClient();
  
  try {
    const dayNames: (keyof WeeklyHours)[] = [
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    ];

    // Validate all days before any database operations
    for (const [dayName, hours] of Object.entries(data)) {
      const validation = validateDayHours(hours as DayHours);
      if (!validation.valid) {
        throw new Error(`${dayName}: ${validation.error}`);
      }
    }

    // Update each day in the database
    for (let i = 0; i < dayNames.length; i++) {
      const dayName = dayNames[i];
      const hours = data[dayName];
      
      const { error } = await supabase
        .from('opening_hours')
        .upsert({
          day_of_week: i,
          is_closed: !hours.isOpen,
          open_time: hours.isOpen ? hours.openTime : null,
          close_time: hours.isOpen ? hours.closeTime : null,
          notes: hours.notes || null,
        }, {
          onConflict: 'day_of_week'
        });

      if (error) {
        console.error(`[Opening Hours] Error updating ${dayName}:`, error);
        throw new Error(`Failed to update ${dayName}: ${error.message}`);
      }
    }

    // Revalidate marketing website cache
    revalidatePath('/');
    console.log('[Opening Hours] Successfully updated weekly schedule');
  } catch (error) {
    console.error('[Opening Hours] Update error:', error);
    throw error instanceof Error ? error : new Error('Unknown error updating opening hours');
  }
}

/**
 * Update single day opening hours - ADMIN ONLY
 * Used by dashboard for individual day modifications
 */
export async function updateDayHours(dayOfWeek: number, hours: DayHours): Promise<void> {
  await requireAuth();
  const supabase = await createClient();
  
  try {
    // Validate input
    if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      throw new Error('Invalid day of week. Must be 0-6 (Monday-Sunday)');
    }
    
    const validation = validateDayHours(hours);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const { error } = await supabase
      .from('opening_hours')
      .upsert({
        day_of_week: dayOfWeek,
        is_closed: !hours.isOpen,
        open_time: hours.isOpen ? hours.openTime : null,
        close_time: hours.isOpen ? hours.closeTime : null,
        notes: hours.notes || null,
      }, {
        onConflict: 'day_of_week'
      });

    if (error) {
      console.error('[Opening Hours] Error updating day:', error);
      throw new Error(`Failed to update day: ${error.message}`);
    }

    // Revalidate marketing website cache
    revalidatePath('/');
    console.log(`[Opening Hours] Successfully updated day ${dayOfWeek}`);
  } catch (error) {
    console.error('[Opening Hours] Day update error:', error);
    throw error instanceof Error ? error : new Error('Unknown error updating day hours');
  }
}

/**
 * Update restaurant info - ADMIN ONLY
 * Used by dashboard to modify restaurant contact details
 */
export async function updateRestaurantInfo(info: Partial<RestaurantInfo>): Promise<void> {
  await requireAuth();
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from('restaurant_info')
      .update({
        ...info,
        updated_at: new Date().toISOString(),
      })
      .eq('id', (await getRestaurantInfo())?.id);

    if (error) {
      console.error('[Restaurant Info] Update error:', error);
      throw new Error(`Failed to update restaurant info: ${error.message}`);
    }

    // Revalidate marketing website cache
    revalidatePath('/');
    console.log('[Restaurant Info] Successfully updated');
  } catch (error) {
    console.error('[Restaurant Info] Update error:', error);
    throw error instanceof Error ? error : new Error('Unknown error updating restaurant info');
  }
}