/**
 * Server-side authentication utilities
 * For use in Server Components and API routes
 */

import { getUser as getSupabaseUser, requireAuth as requireSupabaseAuth, requireNoAuth as requireSupabaseNoAuth } from '@/lib/supabase/server';

// Re-export authentication functions
export { getSupabaseUser as getUser, requireSupabaseAuth as requireAuth, requireSupabaseNoAuth as requireNoAuth };