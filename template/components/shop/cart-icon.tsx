/**
 * 🟩 SHOP-ONLY: Cart Icon with Real Item Count
 * Zustand integration mit real-time updates
 */

'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartItemCount, useCartOpen, useCartHydration } from '@/lib/shop/cart-store'

export function CartIcon() {
  const isHydrated = useCartHydration()
  const itemCount = useCartItemCount()
  const { toggleCart } = useCartOpen()
  
  // During SSR/initial hydration, show 0 items
  const displayCount = isHydrated ? itemCount : 0

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="relative hover:bg-muted/50"
      onClick={toggleCart}
      aria-label={`Warenkorb öffnen (${displayCount} Artikel)`}
    >
      <ShoppingCart className="h-5 w-5" />
      {displayCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold"
        >
          {displayCount > 99 ? '99+' : displayCount}
        </Badge>
      )}
      <span className="sr-only">Warenkorb ({displayCount} Artikel)</span>
    </Button>
  )
}