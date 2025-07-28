'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useUser } from '@/hooks/use-user'
import { useState } from 'react'
import Link from 'next/link'

interface CheckoutButtonProps {
  priceId: string | null
  planName: string
  popular?: boolean
  isFree?: boolean
}

export function CheckoutButton({ priceId, planName, popular = false, isFree = false }: CheckoutButtonProps) {
  const { user, loading } = useUser()
  const [isCreatingSession, setIsCreatingSession] = useState(false)

  const handleCheckout = async () => {
    if (!user) return

    // Free plan - go directly to dashboard
    if (isFree) {
      window.location.href = '/dashboard'
      return
    }

    // Paid plans - create Stripe checkout
    if (!priceId) {
      console.error('Price ID required for paid plans')
      return
    }

    setIsCreatingSession(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        console.error('Error creating checkout session:', data.error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsCreatingSession(false)
    }
  }

  if (loading) {
    return (
      <Button className="w-full" variant={popular ? 'default' : 'outline'} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  if (!user) {
    return (
      <Button 
        className="w-full" 
        variant={popular ? 'default' : 'outline'}
        asChild
      >
        <Link href="/auth/register">
          {isFree ? 'Get Started' : `Subscribe to ${planName}`}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    )
  }

  return (
    <Button 
      className="w-full" 
      variant={popular ? 'default' : 'outline'}
      onClick={handleCheckout}
      disabled={isCreatingSession}
    >
      {isCreatingSession ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {isFree ? 'Start Free' : `Subscribe to ${planName}`}
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  )
}