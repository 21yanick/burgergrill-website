/**
 * 🟩 SHOP-ONLY: Cart Clear Component
 * KISS: Clear cart on successful payment
 */

'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/lib/shop/cart-store'

export function CartClearOnSuccess() {
  const searchParams = useSearchParams()
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    // Only clear cart if we have a session_id (successful payment)
    const sessionId = searchParams.get('session_id')
    
    if (sessionId) {
      // Clear the cart after successful payment
      clearCart()
      
      // Optional: Store order success in localStorage for user feedback
      localStorage.setItem('last_order_success', Date.now().toString())
    }
  }, [searchParams, clearCart])

  // This component doesn't render anything visible
  return null
}