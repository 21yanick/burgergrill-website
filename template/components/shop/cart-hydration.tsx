/**
 * 🟩 SHOP-ONLY: Cart Hydration Component
 * Handles SSR-safe cart state hydration
 */

'use client'

import { useCartHydration } from '@/lib/shop/cart-store'

export function CartHydration() {
  useCartHydration()
  
  // This component doesn't render anything, just handles hydration
  return null
}