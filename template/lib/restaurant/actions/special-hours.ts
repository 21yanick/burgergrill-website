/**
 * 🏖️ SINGLE-TENANT SPECIAL HOURS SERVER ACTIONS
 * Clean server-side operations for restaurant holidays & vacations
 * 
 * Architecture:
 * - PUBLIC functions: No auth needed (marketing website)
 * - ADMIN functions: Auth required (dashboard)  
 * - Direct table access: No complex restaurant_id relations
 * - Date conflict detection and business logic
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

// =====================================================================================
// TYPES (Simplified for Single-Tenant)
// =====================================================================================

export type SpecialHours = {
  id: string;
  date_start: string; // YYYY-MM-DD
  date_end: string;   // YYYY-MM-DD
  is_closed: boolean;
  custom_open_time: string | null;
  custom_close_time: string | null;
  reason: 'Ferien' | 'Feiertag' | 'Wartung' | 'Event' | 'Sonstiges';
  custom_message: string | null;
  show_banner: boolean;
  banner_priority: number;
  created_at: string;
  updated_at: string;
};

export type CreateSpecialHoursData = {
  date_start: string;
  date_end: string;
  is_closed?: boolean;
  custom_open_time?: string | null;
  custom_close_time?: string | null;
  reason?: 'Ferien' | 'Feiertag' | 'Wartung' | 'Event' | 'Sonstiges';
  custom_message?: string | null;
  show_banner?: boolean;
  banner_priority?: number;
};

export type UpdateSpecialHoursData = Partial<CreateSpecialHoursData>;

export type ConflictCheckResult = {
  hasConflict: boolean;
  conflictingPeriods: SpecialHours[];
};

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

  if (start > end) {
    return { valid: false, error: 'Start date must be before or equal to end date' };
  }

  return { valid: true };
}

function validateSpecialHours(data: CreateSpecialHoursData | UpdateSpecialHoursData): { valid: boolean; error?: string } {
  // Date validation
  if (data.date_start && data.date_end) {
    const dateValidation = validateDateRange(data.date_start, data.date_end);
    if (!dateValidation.valid) {
      return dateValidation;
    }
  }

  // Time validation for custom hours
  if (!data.is_closed && data.is_closed !== undefined) {
    if (!data.custom_open_time || !data.custom_close_time) {
      return { valid: false, error: 'Custom open and close times required when not fully closed' };
    }

    if (!validateTimeFormat(data.custom_open_time) || !validateTimeFormat(data.custom_close_time)) {
      return { valid: false, error: 'Invalid time format. Use HH:MM format' };
    }

    if (data.custom_open_time >= data.custom_close_time) {
      return { valid: false, error: 'Custom open time must be before close time' };
    }
  }

  // Banner priority validation
  if (data.banner_priority !== undefined && (data.banner_priority < 1 || data.banner_priority > 10)) {
    return { valid: false, error: 'Banner priority must be between 1 and 10' };
  }

  return { valid: true };
}

// =====================================================================================
// PUBLIC FUNCTIONS (No Auth Required - Marketing Website)
// =====================================================================================

/**
 * Get currently active special hours - PUBLIC ACCESS
 * Used by marketing website to show holiday banner
 */
export async function getActiveSpecialHours(): Promise<SpecialHours | null> {
  const supabase = await createClient();
  
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const { data: activeHours, error } = await supabase
      .from('special_hours')
      .select('*')
      .lte('date_start', today)
      .gte('date_end', today)
      .eq('show_banner', true)
      .order('banner_priority', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('[Special Hours] Database error:', error);
      return null;
    }

    return activeHours || null;
  } catch (error) {
    console.error('[Special Hours] Unexpected error:', error);
    return null;
  }
}

/**
 * Get upcoming special hours - PUBLIC ACCESS  
 * Used by marketing website to show upcoming closures
 */
export async function getUpcomingSpecialHours(days: number = 30): Promise<SpecialHours[]> {
  const supabase = await createClient();
  
  try {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    const { data: upcomingHours, error } = await supabase
      .from('special_hours')
      .select('*')
      .gte('date_start', today)
      .lte('date_start', futureDateStr)
      .eq('show_banner', true)
      .order('date_start', { ascending: true });

    if (error) {
      console.error('[Special Hours] Database error:', error);
      return [];
    }

    return upcomingHours || [];
  } catch (error) {
    console.error('[Special Hours] Unexpected error:', error);
    return [];
  }
}

/**
 * Get all special hours - PUBLIC ACCESS
 * Used by marketing website for complete schedule display
 */
export async function getAllSpecialHours(): Promise<SpecialHours[]> {
  const supabase = await createClient();
  
  try {
    const { data: allHours, error } = await supabase
      .from('special_hours')
      .select('*')
      .order('date_start', { ascending: false });

    if (error) {
      console.error('[Special Hours] Database error:', error);
      return [];
    }

    return allHours || [];
  } catch (error) {
    console.error('[Special Hours] Unexpected error:', error);
    return [];
  }
}

// =====================================================================================
// ADMIN FUNCTIONS (Auth Required - Dashboard Only)
// =====================================================================================

/**
 * Create new special hours period - ADMIN ONLY
 * Used by dashboard to add holidays/vacations
 */
export async function createSpecialPeriod(data: CreateSpecialHoursData): Promise<string> {
  await requireAuth();
  const supabase = await createClient();
  
  try {
    // Validate input data
    const validation = validateSpecialHours(data);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Check for date conflicts
    const conflictCheck = await checkDateConflicts(data.date_start, data.date_end);
    if (conflictCheck.hasConflict) {
      throw new Error(`Date conflict with existing periods: ${conflictCheck.conflictingPeriods.map(p => `${p.date_start} to ${p.date_end}`).join(', ')}`);
    }

    // Create special period
    const { data: createdPeriod, error } = await supabase
      .from('special_hours')
      .insert({
        date_start: data.date_start,
        date_end: data.date_end,
        is_closed: data.is_closed ?? true,
        custom_open_time: data.custom_open_time || null,
        custom_close_time: data.custom_close_time || null,
        reason: data.reason || 'Ferien',
        custom_message: data.custom_message || null,
        show_banner: data.show_banner ?? true,
        banner_priority: data.banner_priority ?? 1,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Special Hours] Create error:', error);
      throw new Error(`Failed to create special period: ${error.message}`);
    }

    // Revalidate marketing website cache
    revalidatePath('/');
    console.log('[Special Hours] Successfully created special period:', createdPeriod.id);
    
    return createdPeriod.id;
  } catch (error) {
    console.error('[Special Hours] Create error:', error);
    throw error instanceof Error ? error : new Error('Unknown error creating special period');
  }
}

/**
 * Update special hours period - ADMIN ONLY
 * Used by dashboard to modify existing holidays/vacations
 */
export async function updateSpecialPeriod(id: string, data: UpdateSpecialHoursData): Promise<void> {
  await requireAuth();
  const supabase = await createClient();
  
  try {
    // Validate input data
    const validation = validateSpecialHours(data);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // If updating dates, check for conflicts (excluding current period)
    if (data.date_start && data.date_end) {
      const conflictCheck = await checkDateConflicts(data.date_start, data.date_end, id);
      if (conflictCheck.hasConflict) {
        throw new Error(`Date conflict with existing periods: ${conflictCheck.conflictingPeriods.map(p => `${p.date_start} to ${p.date_end}`).join(', ')}`);
      }
    }

    // Update special period
    const { error } = await supabase
      .from('special_hours')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('[Special Hours] Update error:', error);
      throw new Error(`Failed to update special period: ${error.message}`);
    }

    // Revalidate marketing website cache
    revalidatePath('/');
    console.log('[Special Hours] Successfully updated special period:', id);
  } catch (error) {
    console.error('[Special Hours] Update error:', error);
    throw error instanceof Error ? error : new Error('Unknown error updating special period');
  }
}

/**
 * Delete special hours period - ADMIN ONLY
 * Used by dashboard to remove holidays/vacations
 */
export async function deleteSpecialPeriod(id: string): Promise<void> {
  await requireAuth();
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from('special_hours')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Special Hours] Delete error:', error);
      throw new Error(`Failed to delete special period: ${error.message}`);
    }

    // Revalidate marketing website cache
    revalidatePath('/');
    console.log('[Special Hours] Successfully deleted special period:', id);
  } catch (error) {
    console.error('[Special Hours] Delete error:', error);
    throw error instanceof Error ? error : new Error('Unknown error deleting special period');
  }
}

/**
 * Check for date conflicts - ADMIN ONLY
 * Used by dashboard to prevent overlapping periods
 */
export async function checkDateConflicts(startDate: string, endDate: string, excludeId?: string): Promise<ConflictCheckResult> {
  await requireAuth();
  const supabase = await createClient();
  
  try {
    let query = supabase
      .from('special_hours')
      .select('*')
      .or(`and(date_start.lte.${endDate},date_end.gte.${startDate})`);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data: conflicts, error } = await query;

    if (error) {
      console.error('[Special Hours] Conflict check error:', error);
      throw new Error(`Failed to check date conflicts: ${error.message}`);
    }

    return {
      hasConflict: (conflicts || []).length > 0,
      conflictingPeriods: conflicts || [],
    };
  } catch (error) {
    console.error('[Special Hours] Conflict check error:', error);
    throw error instanceof Error ? error : new Error('Unknown error checking date conflicts');
  }
}

/**
 * Create quick common holiday periods - ADMIN ONLY
 * Used by dashboard for quick holiday setup
 */
export async function createCommonHoliday(type: 'christmas' | 'newyear' | 'easter' | 'summer', year?: number): Promise<string> {
  await requireAuth();
  
  const currentYear = year || new Date().getFullYear();
  
  const holidayData: Record<string, CreateSpecialHoursData> = {
    christmas: {
      date_start: `${currentYear}-12-24`,
      date_end: `${currentYear}-12-26`,
      reason: 'Feiertag',
      custom_message: 'Frohe Weihnachten! Wir sind vom 24.-26. Dezember geschlossen.',
      banner_priority: 5,
    },
    newyear: {
      date_start: `${currentYear}-12-31`,
      date_end: `${currentYear + 1}-01-02`,
      reason: 'Feiertag', 
      custom_message: 'Guten Rutsch! Wir sind über Neujahr geschlossen.',
      banner_priority: 5,
    },
    easter: {
      date_start: `${currentYear}-04-14`, // This would need dynamic calculation
      date_end: `${currentYear}-04-17`,
      reason: 'Feiertag',
      custom_message: 'Frohe Ostern! Wir sind über die Osterfeiertage geschlossen.',
      banner_priority: 4,
    },
    summer: {
      date_start: `${currentYear}-07-15`,
      date_end: `${currentYear}-07-29`, 
      reason: 'Ferien',
      custom_message: 'Sommerferien! Wir sind vom 15.-29. Juli in den Ferien.',
      banner_priority: 3,
    },
  };

  return await createSpecialPeriod(holidayData[type]);
}