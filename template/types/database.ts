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
    };
  };
};

// 🎯 HELPER TYPES: Restaurant website specific exports
export type Profile = Database['public']['Tables']['profiles']['Row'];