/**
 * 🎯 STARTER KIT DATABASE TYPES
 * Self-explanatory structure with SHARED vs BUSINESS-SPECIFIC separation
 * 
 * CONVERSION GUIDE:
 * - SaaS only: Remove shop tables (products, orders, order_items)
 * - Shop only: Remove saas tables (subscriptions)
 * - Keep SHARED: profiles (always needed for users)
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
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 🟦 SAAS-ONLY: Subscription management
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_price_id: string;
          plan_type: 'free' | 'starter' | 'pro' | 'enterprise';
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_price_id: string;
          plan_type?: 'free' | 'starter' | 'pro' | 'enterprise';
          status: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string;
          stripe_price_id?: string;
          plan_type?: 'free' | 'starter' | 'pro' | 'enterprise';
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 🟩 SHOP-ONLY: Product catalog
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number; // Swiss CHF in Rappen (cents)
          currency: string;
          image_url: string | null;
          category: string | null;
          stock_quantity: number;
          digital: boolean; // true = digital product (no shipping), false = physical product (shipping required)
          active: boolean;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          currency?: string;
          image_url?: string | null;
          category?: string | null;
          stock_quantity?: number;
          digital?: boolean;
          active?: boolean;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          currency?: string;
          image_url?: string | null;
          category?: string | null;
          stock_quantity?: number;
          digital?: boolean;
          active?: boolean;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 🟩 SHOP-ONLY: Customer orders (guest checkout supported)
      orders: {
        Row: {
          id: string;
          user_id: string | null; // null = guest checkout
          email: string;
          status: string;
          total_amount: number; // Swiss CHF in Rappen (cents)
          currency: string;
          stripe_payment_intent_id: string | null;
          stripe_session_id: string | null;
          shipping_address: Record<string, any> | null;
          billing_address: Record<string, any> | null;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email: string;
          status?: string;
          total_amount: number;
          currency?: string;
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          shipping_address?: Record<string, any> | null;
          billing_address?: Record<string, any> | null;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          email?: string;
          status?: string;
          total_amount?: number;
          currency?: string;
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          shipping_address?: Record<string, any> | null;
          billing_address?: Record<string, any> | null;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };

      // 🟩 SHOP-ONLY: Order line items
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          unit_price: number; // Swiss CHF in Rappen (cents)
          total_price: number; // Swiss CHF in Rappen (cents)
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          quantity?: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
      };
    };
  };
};

// 🎯 HELPER TYPES: Business model specific exports
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row']; // 🟦 SAAS-ONLY
export type Product = Database['public']['Tables']['products']['Row']; // 🟩 SHOP-ONLY
export type Order = Database['public']['Tables']['orders']['Row']; // 🟩 SHOP-ONLY
export type OrderItem = Database['public']['Tables']['order_items']['Row']; // 🟩 SHOP-ONLY