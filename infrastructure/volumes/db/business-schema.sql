-- NextJS Swiss SaaS Template - Modular Business Schema
-- Built on top of official Supabase schema
--
-- This template loads only the required schema modules for a SaaS application.
-- To extend to other business models, uncomment the appropriate modules below.

-- =============================================================================
-- CORE MODULES (Required for all business models)
-- =============================================================================

\i 00-core-schema.sql

-- =============================================================================
-- SAAS MODULE (Default for this template)
-- =============================================================================

\i 01-saas-schema.sql

-- =============================================================================
-- OPTIONAL MODULES (Uncomment to enable additional business models)
-- =============================================================================

-- E-Commerce / Shop functionality
-- Uncomment the line below to enable product catalog, orders, and shopping cart
-- \i 02-shop-schema.sql

-- Booking / Appointment functionality  
-- Uncomment the line below to enable appointment scheduling and calendar features
-- \i 03-booking-schema.sql

-- =============================================================================
-- CONFIGURATION NOTES
-- =============================================================================
--
-- To add Shop functionality:
-- 1. Uncomment: \i 02-shop-schema.sql
-- 2. Restart database containers
-- 3. Add shop-specific Stripe integration to your template
-- 4. Update API routes for product/order management
--
-- To add Booking functionality:
-- 1. Uncomment: \i 03-booking-schema.sql  
-- 2. Restart database containers
-- 3. Add booking-specific Stripe integration to your template
-- 4. Update API routes for appointment management
--
-- All schemas are Swiss-optimized:
-- - Prices stored in Rappen (CHF cents)
-- - Default currency: CHF
-- - Timezone-aware for Europe/Zurich
-- - Row Level Security (RLS) enabled for multi-tenant usage
--