/**
 * 🎯 BURGERGRILL DATABASE TYPES
 * TypeScript definitions for restaurant database schema
 * 
 * RESTAURANT DATABASE SCHEMA:
 * - Clean restaurant-focused schema
 * - User profiles for customer accounts
 * - Integrates with Supabase Auth
 */

export type Database = {
  public: {
    Tables: {
      // ✅ SHARED: User profiles (core functionality)
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      // 🏢 RESTAURANT: Business settings and configuration
      restaurant_settings: {
        Row: {
          id: string;
          profile_id: string;
          business_name: string;
          phone: string | null;
          email: string | null;
          street: string | null;
          city: string | null;
          postal_code: string | null;
          country: string;
          google_maps_url: string | null;
          special_notice_text: string | null;
          special_notice_active: boolean;
          special_notice_priority: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          business_name?: string;
          phone?: string | null;
          email?: string | null;
          street?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string;
          google_maps_url?: string | null;
          special_notice_text?: string | null;
          special_notice_active?: boolean;
          special_notice_priority?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          business_name?: string;
          phone?: string | null;
          email?: string | null;
          street?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string;
          google_maps_url?: string | null;
          special_notice_text?: string | null;
          special_notice_active?: boolean;
          special_notice_priority?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      // 🕒 OPENING HOURS: Weekly schedule management
      opening_hours: {
        Row: {
          id: string;
          restaurant_id: string;
          day_of_week: number; // 0=Monday, 6=Sunday
          is_closed: boolean;
          open_time: string | null; // TIME format "HH:MM"
          close_time: string | null; // TIME format "HH:MM"
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          day_of_week: number;
          is_closed?: boolean;
          open_time?: string | null;
          close_time?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          day_of_week?: number;
          is_closed?: boolean;
          open_time?: string | null;
          close_time?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      // 🏖️ SPECIAL HOURS: Holidays, vacations, special events
      special_hours: {
        Row: {
          id: string;
          restaurant_id: string;
          date_start: string; // DATE format "YYYY-MM-DD"
          date_end: string; // DATE format "YYYY-MM-DD"
          is_closed: boolean;
          custom_open_time: string | null; // TIME format "HH:MM"
          custom_close_time: string | null; // TIME format "HH:MM"
          reason: 'Ferien' | 'Feiertag' | 'Wartung' | 'Event' | 'Sonstiges';
          custom_message: string | null;
          show_banner: boolean;
          banner_priority: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          date_start: string;
          date_end: string;
          is_closed?: boolean;
          custom_open_time?: string | null;
          custom_close_time?: string | null;
          reason?: 'Ferien' | 'Feiertag' | 'Wartung' | 'Event' | 'Sonstiges';
          custom_message?: string | null;
          show_banner?: boolean;
          banner_priority?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          date_start?: string;
          date_end?: string;
          is_closed?: boolean;
          custom_open_time?: string | null;
          custom_close_time?: string | null;
          reason?: 'Ferien' | 'Feiertag' | 'Wartung' | 'Event' | 'Sonstiges';
          custom_message?: string | null;
          show_banner?: boolean;
          banner_priority?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 📂 MENU CATEGORIES: Menu organization (Phase 2)
      menu_categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description: string | null;
          icon_emoji: string | null;
          sort_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          description?: string | null;
          icon_emoji?: string | null;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          description?: string | null;
          icon_emoji?: string | null;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 🍔 MENU ITEMS: Individual menu items (Phase 2)
      menu_items: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string | null;
          price_chf: number | null;
          is_signature: boolean;
          is_profitable: boolean;
          is_vegetarian: boolean;
          is_vegan: boolean;
          available: boolean;
          sold_out: boolean;
          sort_order: number;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          description?: string | null;
          price_chf?: number | null;
          is_signature?: boolean;
          is_profitable?: boolean;
          is_vegetarian?: boolean;
          is_vegan?: boolean;
          available?: boolean;
          sold_out?: boolean;
          sort_order?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          description?: string | null;
          price_chf?: number | null;
          is_signature?: boolean;
          is_profitable?: boolean;
          is_vegetarian?: boolean;
          is_vegan?: boolean;
          available?: boolean;
          sold_out?: boolean;
          sort_order?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      // 🔍 UTILITY: Get current restaurant status
      get_restaurant_status: {
        Args: { restaurant_uuid: string };
        Returns: {
          is_open: boolean;
          current_message: string;
          next_opening: string | null;
        }[];
      };
    };
  };
};

// 🎯 HELPER TYPES: Restaurant website specific exports
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type RestaurantSettings = Database['public']['Tables']['restaurant_settings']['Row'];
export type OpeningHours = Database['public']['Tables']['opening_hours']['Row'];
export type SpecialHours = Database['public']['Tables']['special_hours']['Row'];
export type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];
export type MenuItem = Database['public']['Tables']['menu_items']['Row'];

// 🕒 OPENING HOURS: Helper types for dashboard components
export type WeeklyHoursData = {
  [key in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']: {
    isOpen: boolean;
    openTime: string | null;
    closeTime: string | null;
    notes?: string | null;
  };
};

// 🏖️ SPECIAL HOURS: Helper types for holiday management
export type SpecialPeriod = {
  id: string;
  startDate: string;
  endDate: string;
  isClosed: boolean;
  customOpenTime?: string | null;
  customCloseTime?: string | null;
  reason: SpecialHours['reason'];
  customMessage?: string | null;
  showBanner: boolean;
  priority: number;
};

// 🔍 RESTAURANT STATUS: Function return type
export type RestaurantStatus = {
  isOpen: boolean;
  currentMessage: string;
  nextOpening: string | null;
};