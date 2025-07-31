/**
 * 📅 SPECIAL HOURS SERVER ACTIONS
 * Clean server-side operations for restaurant special hours management (holidays, vacations, etc.)
 * 
 * Architecture:
 * - Type-safe database operations with Supabase
 * - Date conflict detection and business logic
 * - Banner priority management
 * - Next.js Server Actions for dashboard integration
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import type { 
  Database, 
  SpecialHours, 
  SpecialPeriod,
  RestaurantSettings 
} from '@/types/database';

// =====================================================================================
// TYPES & VALIDATION
// =====================================================================================

export interface CreateSpecialPeriodData {
  dateStart: string;   // Format: "YYYY-MM-DD"
  dateEnd: string;     // Format: "YYYY-MM-DD"
  isClosed: boolean;
  customOpenTime?: string | null;  // Format: "HH:MM" (24h)
  customCloseTime?: string | null; // Format: "HH:MM" (24h)
  reason: SpecialHours['reason'];
  customMessage?: string | null;
  showBanner?: boolean;
  bannerPriority?: number; // 1-10, higher = more important
}

export interface UpdateSpecialPeriodData extends CreateSpecialPeriodData {
  id: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingPeriods?: SpecialHours[];
  message?: string;
}

// =====================================================================================
// VALIDATION HELPERS
// =====================================================================================

function validateDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
}

function validateTimeFormat(time: string | null): boolean {
  if (!time) return true; // null is valid
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}

function validateDateRange(startDate: string, endDate: string): { valid: boolean; error?: string } {
  if (!validateDateFormat(startDate) || !validateDateFormat(endDate)) {
    return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  if (start < today) {
    return { valid: false, error: 'Start date cannot be in the past' };
  }

  if (start > end) {
    return { valid: false, error: 'Start date must be before or equal to end date' };
  }

  return { valid: true };
}

function validateSpecialPeriod(data: CreateSpecialPeriodData): { valid: boolean; error?: string } {
  // Validate date range
  const dateValidation = validateDateRange(data.dateStart, data.dateEnd);
  if (!dateValidation.valid) {
    return dateValidation;
  }

  // If not closed, must have custom times
  if (!data.isClosed) {
    if (!data.customOpenTime || !data.customCloseTime) {
      return { valid: false, error: 'Custom opening hours require both open and close times' };
    }

    // Validate time formats
    if (!validateTimeFormat(data.customOpenTime) || !validateTimeFormat(data.customCloseTime)) {
      return { valid: false, error: 'Invalid time format. Use HH:MM (24h)' };
    }

    // Validate logical time order
    if (data.customOpenTime >= data.customCloseTime) {
      return { valid: false, error: 'Opening time must be before closing time' };
    }
  }

  // Validate banner priority
  if (data.bannerPriority && (data.bannerPriority < 1 || data.bannerPriority > 10)) {
    return { valid: false, error: 'Banner priority must be between 1 and 10' };
  }

  // Validate custom message length
  if (data.customMessage && data.customMessage.length > 200) {
    return { valid: false, error: 'Custom message cannot exceed 200 characters' };
  }

  return { valid: true };
}

// =====================================================================================
// RESTAURANT SETTINGS HELPER (reuse from opening-hours pattern)
// =====================================================================================

async function getRestaurantSettings(): Promise<RestaurantSettings> {
  const user = await requireAuth();
  const supabase = await createClient();

  try {
    const { data: settings, error } = await supabase
      .from('restaurant_settings')
      .select('*')
      .eq('profile_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[Special Hours] Restaurant settings error:', error);
      throw new Error(`Failed to fetch restaurant settings: ${error.message}`);
    }

    if (!settings) {
      throw new Error('Restaurant settings not found. Please contact support.');
    }

    return settings;
  } catch (error) {
    console.error('[Special Hours] Restaurant settings error:', error);
    throw error instanceof Error ? error : new Error('Unknown error fetching restaurant settings');
  }
}

// =====================================================================================
// SPECIAL HOURS OPERATIONS
// =====================================================================================

/**
 * Get all special hours for restaurant
 * Returns periods ordered by date (upcoming first)
 */
export async function getSpecialHours(): Promise<SpecialHours[]> {
  const settings = await getRestaurantSettings();
  const supabase = await createClient();

  try {
    const { data: specialHours, error } = await supabase
      .from('special_hours')
      .select('*')
      .eq('restaurant_id', settings.id)
      .order('date_start');

    if (error) {
      console.error('[Special Hours] Database error:', error);
      throw new Error(`Failed to fetch special hours: ${error.message}`);
    }

    return specialHours || [];
  } catch (error) {
    console.error('[Special Hours] Get error:', error);
    throw error instanceof Error ? error : new Error('Unknown error fetching special hours');
  }
}

/**
 * Get currently active special hours (current date within range)
 */
export async function getActiveSpecialHours(): Promise<SpecialHours | null> {
  const settings = await getRestaurantSettings();
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  try {
    const { data: activeHours, error } = await supabase
      .from('special_hours')
      .select('*')
      .eq('restaurant_id', settings.id)
      .lte('date_start', today)
      .gte('date_end', today)
      .eq('show_banner', true)
      .order('banner_priority', { ascending: false })
      .limit(1);

    if (error) {
      console.error('[Special Hours] Active query error:', error);
      throw new Error(`Failed to fetch active special hours: ${error.message}`);
    }

    return activeHours?.[0] || null;
  } catch (error) {
    console.error('[Special Hours] Active error:', error);
    // Return null instead of throwing to allow graceful degradation
    return null;
  }
}

/**
 * Get upcoming special hours (next 30 days)
 */
export async function getUpcomingSpecialHours(): Promise<SpecialHours[]> {
  const settings = await getRestaurantSettings();
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  const futureLimit = futureDate.toISOString().split('T')[0];

  try {
    const { data: upcomingHours, error } = await supabase
      .from('special_hours')
      .select('*')
      .eq('restaurant_id', settings.id)
      .gte('date_start', today)
      .lte('date_start', futureLimit)
      .order('date_start');

    if (error) {
      console.error('[Special Hours] Upcoming query error:', error);
      throw new Error(`Failed to fetch upcoming special hours: ${error.message}`);
    }

    return upcomingHours || [];
  } catch (error) {
    console.error('[Special Hours] Upcoming error:', error);
    throw error instanceof Error ? error : new Error('Unknown error fetching upcoming special hours');
  }
}

/**
 * Check for date conflicts with existing periods
 * Returns conflicting periods if any overlap is found
 */
export async function checkDateConflicts(
  dateStart: string, 
  dateEnd: string, 
  excludeId?: string
): Promise<ConflictCheckResult> {
  const settings = await getRestaurantSettings();
  const supabase = await createClient();

  try {
    let query = supabase
      .from('special_hours')
      .select('*')
      .eq('restaurant_id', settings.id)
      .or(`and(date_start.lte.${dateEnd},date_end.gte.${dateStart})`);

    // Exclude specific period if editing
    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data: conflicts, error } = await query;

    if (error) {
      console.error('[Special Hours] Conflict check error:', error);
      throw new Error(`Failed to check date conflicts: ${error.message}`);
    }

    const hasConflict = conflicts && conflicts.length > 0;
    
    return {
      hasConflict,
      conflictingPeriods: hasConflict ? conflicts : undefined,
      message: hasConflict 
        ? `Conflict found with ${conflicts.length} existing period(s)` 
        : undefined
    };
  } catch (error) {
    console.error('[Special Hours] Conflict check error:', error);
    throw error instanceof Error ? error : new Error('Unknown error checking date conflicts');
  }
}

/**
 * Create a new special period (holiday, vacation, etc.)
 */
export async function createSpecialPeriod(data: CreateSpecialPeriodData): Promise<string> {
  const settings = await getRestaurantSettings();
  const supabase = await createClient();

  try {
    // Validate input data
    const validation = validateSpecialPeriod(data);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid period data');
    }

    // Check for date conflicts
    const conflictCheck = await checkDateConflicts(data.dateStart, data.dateEnd);
    if (conflictCheck.hasConflict) {
      throw new Error(`Date conflict detected: ${conflictCheck.message}`);
    }

    // Insert new special period
    const { data: insertData, error } = await supabase
      .from('special_hours')
      .insert({
        restaurant_id: settings.id,
        date_start: data.dateStart,
        date_end: data.dateEnd,
        is_closed: data.isClosed,
        custom_open_time: data.isClosed ? null : data.customOpenTime,
        custom_close_time: data.isClosed ? null : data.customCloseTime,
        reason: data.reason,
        custom_message: data.customMessage,
        show_banner: data.showBanner ?? true,
        banner_priority: data.bannerPriority ?? 1,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Special Hours] Create error:', error);
      throw new Error(`Failed to create special period: ${error.message}`);
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard/special-hours');
    revalidatePath('/'); // Main page with special hours display

    console.log(`[Special Hours] Successfully created period ${insertData.id} for restaurant ${settings.id}`);
    return insertData.id;
  } catch (error) {
    console.error('[Special Hours] Create error:', error);
    throw error instanceof Error ? error : new Error('Unknown error creating special period');
  }
}

/**
 * Update an existing special period
 */
export async function updateSpecialPeriod(data: UpdateSpecialPeriodData): Promise<void> {
  const settings = await getRestaurantSettings();
  const supabase = await createClient();

  try {
    // Validate input data
    const validation = validateSpecialPeriod(data);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid period data');
    }

    // Verify ownership and existence
    const { data: existing, error: existingError } = await supabase
      .from('special_hours')
      .select('*')
      .eq('id', data.id)
      .eq('restaurant_id', settings.id)
      .single();

    if (existingError || !existing) {
      throw new Error('Special period not found or access denied');
    }

    // Check for date conflicts (excluding current period)
    const conflictCheck = await checkDateConflicts(data.dateStart, data.dateEnd, data.id);
    if (conflictCheck.hasConflict) {
      throw new Error(`Date conflict detected: ${conflictCheck.message}`);
    }

    // Update the period
    const { error: updateError } = await supabase
      .from('special_hours')
      .update({
        date_start: data.dateStart,
        date_end: data.dateEnd,
        is_closed: data.isClosed,
        custom_open_time: data.isClosed ? null : data.customOpenTime,
        custom_close_time: data.isClosed ? null : data.customCloseTime,
        reason: data.reason,
        custom_message: data.customMessage,
        show_banner: data.showBanner ?? true,
        banner_priority: data.bannerPriority ?? 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.id);

    if (updateError) {
      console.error('[Special Hours] Update error:', updateError);
      throw new Error(`Failed to update special period: ${updateError.message}`);
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard/special-hours');
    revalidatePath('/');

    console.log(`[Special Hours] Successfully updated period ${data.id} for restaurant ${settings.id}`);
  } catch (error) {
    console.error('[Special Hours] Update error:', error);
    throw error instanceof Error ? error : new Error('Unknown error updating special period');
  }
}

/**
 * Delete a special period
 */
export async function deleteSpecialPeriod(id: string): Promise<void> {
  const settings = await getRestaurantSettings();
  const supabase = await createClient();

  try {
    // Verify ownership and delete
    const { error } = await supabase
      .from('special_hours')
      .delete()
      .eq('id', id)
      .eq('restaurant_id', settings.id);

    if (error) {
      console.error('[Special Hours] Delete error:', error);
      throw new Error(`Failed to delete special period: ${error.message}`);
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard/special-hours');
    revalidatePath('/');

    console.log(`[Special Hours] Successfully deleted period ${id} for restaurant ${settings.id}`);
  } catch (error) {
    console.error('[Special Hours] Delete error:', error);
    throw error instanceof Error ? error : new Error('Unknown error deleting special period');
  }
}

// =====================================================================================
// CONVENIENCE FUNCTIONS
// =====================================================================================

/**
 * Create common holiday periods with smart defaults
 */
export async function createCommonHoliday(
  holiday: 'christmas' | 'new_year' | 'easter' | 'summer_vacation',
  year?: number
): Promise<string> {
  const currentYear = year || new Date().getFullYear();
  
  const holidayConfigs = {
    christmas: {
      dateStart: `${currentYear}-12-24`,
      dateEnd: `${currentYear}-12-26`,
      reason: 'Feiertag' as const,
      customMessage: 'Frohe Weihnachten! Wir sind über die Feiertage geschlossen.',
      bannerPriority: 10
    },
    new_year: {
      dateStart: `${currentYear}-12-31`,
      dateEnd: `${currentYear + 1}-01-02`,
      reason: 'Feiertag' as const,
      customMessage: 'Frohes neues Jahr! Wir sind über Neujahr geschlossen.',
      bannerPriority: 10
    },
    easter: {
      dateStart: `${currentYear}-04-07`, // Good Friday (approximate)
      dateEnd: `${currentYear}-04-10`, // Easter Monday (approximate)
      reason: 'Feiertag' as const,
      customMessage: 'Frohe Ostern! Wir sind über die Osterfeiertage geschlossen.',
      bannerPriority: 8
    },
    summer_vacation: {
      dateStart: `${currentYear}-07-15`,
      dateEnd: `${currentYear}-08-15`,
      reason: 'Ferien' as const,
      customMessage: 'Wir sind in den Sommerferien. Wir freuen uns auf Ihren Besuch nach unserer Rückkehr!',
      bannerPriority: 5
    }
  };

  const config = holidayConfigs[holiday];
  
  return createSpecialPeriod({
    ...config,
    isClosed: true,
    showBanner: true
  });
}