/**
 * Subscription Management Page - Server Component
 * Optimized with server-side auth and static content rendering
 */

import { Container } from '@/components/ui/container'
import { 
  PlanStatus, 
  PlanActions, 
  BillingHistory, 
  PlanComparison 
} from '@/components/billing'
import { requireAuth, getUserSubscription, getBillingHistory } from '@/lib/auth/server'

export default async function SubscriptionPage() {
  // Server-side authentication check - no client-side loading or redirect needed
  const user = await requireAuth();
  
  // Server-side data fetching
  const [userSubscription, billingHistory] = await Promise.all([
    getUserSubscription(user.id),
    getBillingHistory(user.id)
  ]);

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Subscription Management</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing settings.
        </p>
      </div>

      {/* Main Content - Mixed server/client */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Status - Client Island */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Current Plan</h3>
          <PlanStatus initialData={userSubscription} />
        </div>

        {/* Plan Actions - Client Island */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Manage Plan</h3>
          <PlanActions initialData={userSubscription} />
        </div>
      </div>

      {/* Plan Comparison - Server Component */}
      <PlanComparison />

      {/* Billing History - Client Island */}
      <BillingHistory initialData={billingHistory} />
    </>
  )
}