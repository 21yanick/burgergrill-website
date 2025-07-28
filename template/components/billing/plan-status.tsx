'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSubscription } from '@/hooks/use-subscription'
import { CalendarDays, CreditCard } from 'lucide-react'
import { getPlan } from '@/lib/plans'
import type { ServerUserPlan } from '@/lib/auth/server'

interface PlanStatusProps {
  initialData?: ServerUserPlan;
}

export function PlanStatus({ initialData }: PlanStatusProps) {
  // Use server-side initial data, fall back to hook for real-time updates
  const { userPlan, loading, planType } = useSubscription(initialData)

  if (loading && !initialData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Use centralized plan configuration
  const currentPlanType = planType || initialData?.type || 'free'
  const planInfo = getPlan(currentPlanType)
  const subscription = userPlan?.subscription || initialData?.subscription

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Current Plan</span>
          <Badge variant={planInfo.badgeVariant}>
            {planInfo.icon} {planInfo.name}
          </Badge>
        </CardTitle>
        <CardDescription>{planInfo.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Plan Price */}
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {planInfo.price === 0 ? 'Free forever' : 
             `${planInfo.currency} ${planInfo.price.toFixed(2)}/${planInfo.interval}`}
          </span>
        </div>

        {/* Billing Date - only for paid plans */}
        {subscription && subscription.currentPeriodEnd && (
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Status indicator */}
        <div className="text-xs text-muted-foreground">
          {currentPlanType === 'free' ? 'No subscription required' :
           subscription?.status === 'active' ? 'Active subscription' :
           'Subscription inactive'}
        </div>
      </CardContent>
    </Card>
  )
}