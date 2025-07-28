/**
 * Server-side authentication and subscription utilities
 * For use in Server Components and API routes
 */

import { getUser as getSupabaseUser, requireAuth as requireSupabaseAuth, requireNoAuth as requireSupabaseNoAuth, createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { PlanType } from '@/lib/plans';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export interface ServerUserPlan {
  type: PlanType;
  subscription?: {
    id: string;
    stripeSubscriptionId: string;
    status: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    priceId: string;
  };
}

// Re-export existing functions
export { getSupabaseUser as getUser, requireSupabaseAuth as requireAuth, requireSupabaseNoAuth as requireNoAuth };

/**
 * Get user's subscription data server-side
 */
export async function getUserSubscription(userId: string): Promise<ServerUserPlan> {
  try {
    const supabase = await createClient();
    
    // Fetch user's active subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscription:', error);
      return { type: 'free' };
    }

    if (subscription) {
      return {
        type: subscription.plan_type as PlanType,
        subscription: {
          id: subscription.id,
          stripeSubscriptionId: subscription.stripe_subscription_id,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          priceId: subscription.stripe_price_id,
        },
      };
    }

    // No active subscription, user is on free plan
    return { type: 'free' };
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    return { type: 'free' };
  }
}

/**
 * Get user with subscription data in one call
 * Optimized for server components that need both
 */
export async function getUserWithSubscription(): Promise<{
  user: User | null;
  subscription: ServerUserPlan;
}> {
  const user = await getSupabaseUser();
  
  if (!user) {
    return {
      user: null,
      subscription: { type: 'free' }
    };
  }
  
  const subscription = await getUserSubscription(user.id);
  
  return {
    user,
    subscription
  };
}

/**
 * Get billing history for user (server-side)
 * TODO: Implement real billing history from Stripe
 */
export async function getBillingHistory(userId: string) {
  // Mock data for now - replace with real Stripe API call
  return [
    {
      id: 'inv_001',
      date: '2024-01-15',
      amount: 9.90,
      currency: 'CHF',
      status: 'paid' as const,
      plan: 'Starter',
      invoiceUrl: '#'
    }
  ];
}