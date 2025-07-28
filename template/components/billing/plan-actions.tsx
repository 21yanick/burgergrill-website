'use client'

import { Button } from '@/components/ui/button'
import { useSubscription } from '@/hooks/use-subscription'
import { useState } from 'react'
import { ArrowUp, X, Loader2 } from 'lucide-react'
import type { ServerUserPlan } from '@/lib/auth/server'

interface PlanActionsProps {
  initialData?: ServerUserPlan;
}

export function PlanActions({ initialData }: PlanActionsProps) {
  const { userPlan, planType, refresh } = useSubscription(initialData)
  const [loading, setLoading] = useState<string | null>(null)

  // Get current plan type from hook or initial data
  const currentPlanType = planType || initialData?.type || 'free'

  const handleUpgrade = async (targetPlan: 'starter' | 'pro') => {
    setLoading(`upgrade-${targetPlan}`)
    try {
      // Get price ID from API endpoint instead of accessing server env directly
      const priceResponse = await fetch(`/api/subscription/price-ids`)
      const priceData = await priceResponse.json()
      const priceId = targetPlan === 'starter' ? priceData.starterPriceId : priceData.proPriceId

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()
      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        console.error('Upgrade failed:', data.error)
      }
    } catch (error) {
      console.error('Error upgrading:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleCancel = async () => {
    const subscription = userPlan?.subscription || initialData?.subscription
    if (!subscription) return

    setLoading('cancel')
    try {
      // TODO: Implement cancel subscription API
      console.log('Cancel subscription:', subscription.id)
      // For now, just refresh
      await refresh()
    } catch (error) {
      console.error('Error cancelling:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      {/* Free Plan Actions */}
      {currentPlanType === 'free' && (
        <div className="space-y-2">
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => handleUpgrade('starter')}
            disabled={loading === 'upgrade-starter'}
          >
            {loading === 'upgrade-starter' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade to Starter (CHF 9.90/month)
              </>
            )}
          </Button>
          
          <Button 
            className="w-full"
            onClick={() => handleUpgrade('pro')}
            disabled={loading === 'upgrade-pro'}
          >
            {loading === 'upgrade-pro' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade to Pro (CHF 19.90/month)
              </>
            )}
          </Button>
        </div>
      )}

      {/* Starter Plan Actions */}
      {currentPlanType === 'starter' && (
        <div className="space-y-2">
          <Button 
            className="w-full"
            onClick={() => handleUpgrade('pro')}
            disabled={loading === 'upgrade-pro'}
          >
            {loading === 'upgrade-pro' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade to Pro (CHF 19.90/month)
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleCancel}
            disabled={loading === 'cancel'}
          >
            {loading === 'cancel' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel Subscription
              </>
            )}
          </Button>
        </div>
      )}

      {/* Pro Plan Actions */}
      {currentPlanType === 'pro' && (
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleCancel}
            disabled={loading === 'cancel'}
          >
            {loading === 'cancel' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel Subscription
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}