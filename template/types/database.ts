/**
 * 🎯 SINGLE-TENANT DATABASE TYPES  
 * Clean TypeScript definitions for single restaurant architecture
 * 
 * ARCHITECTURE:
 * - Single restaurant focus (KISS principle)
 * - Public data access (no complex auth relations)
 * - Clean separation: Marketing vs Dashboard
 * - Direct table access (no unnecessary joins)
 */

// =====================================================================================
// DATABASE SCHEMA TYPES
// =====================================================================================

export type Database = {
  public: {
    Tables: {
      // User profiles (Supabase Auth integration) 
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };

      // Restaurant business information (single row)
      restaurant_info: {
        Row: {
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
        Insert: {
          business_name?: string;
          phone?: string | null;
          email?: string | null;
          street?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string | null;
          google_maps_url?: string | null;
          maps_embed_src?: string | null;
        };
        Update: {
          business_name?: string;
          phone?: string | null;
          email?: string | null;
          street?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string | null;
          google_maps_url?: string | null;
          maps_embed_src?: string | null;
        };
      };

      // Weekly opening hours (7 rows)
      opening_hours: {
        Row: {
          id: string;
          day_of_week: number; // 0=Monday, 6=Sunday
          is_closed: boolean;
          open_time: string | null; // HH:MM:SS format
          close_time: string | null; // HH:MM:SS format
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          day_of_week: number;
          is_closed?: boolean;
          open_time?: string | null;
          close_time?: string | null;
          notes?: string | null;
        };
        Update: {
          is_closed?: boolean;
          open_time?: string | null;
          close_time?: string | null;
          notes?: string | null;
        };
      };

      // Special hours (holidays, vacations) 
      special_hours: {
        Row: {
          id: string;
          date_start: string; // YYYY-MM-DD
          date_end: string; // YYYY-MM-DD
          is_closed: boolean;
          custom_open_time: string | null;
          custom_close_time: string | null;
          reason: 'Ferien' | 'Feiertag' | 'Wartung' | 'Event' | 'Sonstiges';
          custom_message: string | null;
          show_banner: boolean;
          banner_priority: number; // 1-10
          created_at: string;
          updated_at: string;
        };
        Insert: {
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
        Update: {
          date_start?: string;
          date_end?: string;
          is_closed?: boolean;
          custom_open_time?: string | null;
          custom_close_time?: string | null;
          reason?: 'Ferien' | 'Feiertag' | 'Wartung' | 'Event' | 'Sonstiges';
          custom_message?: string | null;
          show_banner?: boolean;
          banner_priority?: number;
        };
      };
    };
  };
};

// =====================================================================================
// BUSINESS LOGIC TYPES (Clean, reusable)
// =====================================================================================

// Single day hours structure
export type DayHours = {
  isOpen: boolean;
  openTime: string | null; // HH:MM format
  closeTime: string | null; // HH:MM format  
  notes?: string | null;
};

// Weekly hours structure (for dashboard editing)
export type WeeklyHours = {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
};

// Display-ready hours (for marketing website)
export type DisplayHours = {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};

// Restaurant basic info
export type RestaurantInfo = Database['public']['Tables']['restaurant_info']['Row'];

// Special hours/holidays
export type SpecialHours = Database['public']['Tables']['special_hours']['Row'];

// Restaurant operational status
export type RestaurantStatus = {
  isOpen: boolean;
  currentDay: string;
  todayHours: DayHours;
  nextChange: string | null;
};

// =====================================================================================  
// UTILITY TYPES
// =====================================================================================

// For dashboard day updates
export type UpdateDayRequest = {
  dayOfWeek: number; // 0-6
  hours: DayHours;
};

// For dashboard batch updates
export type UpdateWeekRequest = {
  updates: UpdateDayRequest[];
};

// Special hours creation
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

// Special hours updates
export type UpdateSpecialHoursData = Partial<CreateSpecialHoursData>;

// Conflict checking result
export type ConflictCheckResult = {
  hasConflict: boolean;
  conflictingPeriods: SpecialHours[];
};