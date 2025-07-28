/**
 * 🟩 SHOP-ONLY: Shopping Cart Slideout Component
 * Modern Cart UI mit Zustand Integration
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCartStore, useCartOpen, useCartTotal, type CartItem } from '@/lib/shop/cart-store'
import { createCheckoutSession } from '@/lib/shop/checkout-actions'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function ShoppingCart() {
  const { isOpen, closeCart } = useCartOpen()
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const totalInCHF = useCartTotal()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Cart Slideout */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">
                Warenkorb
              </h2>
              {items.length > 0 && (
                <Badge variant="secondary">
                  {items.length} {items.length === 1 ? 'Artikel' : 'Artikel'}
                </Badge>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={closeCart}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Warenkorb schließen</span>
            </Button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <EmptyCart onClose={closeCart} />
            ) : (
              <CartItems 
                items={items}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
            )}
          </div>

          {/* Footer - Checkout */}
          {items.length > 0 && (
            <CartFooter 
              total={totalInCHF}
              onClearCart={clearCart}
              onClose={closeCart}
            />
          )}
        </div>
      </div>
    </>
  )
}

// Empty Cart State
function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full">
      <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        Ihr Warenkorb ist leer
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Entdecken Sie unsere Produkte und fügen Sie Artikel hinzu.
      </p>
      <Button asChild onClick={onClose}>
        <Link href="/shop">
          Zum Shop
        </Link>
      </Button>
    </div>
  )
}

// Cart Items List
function CartItems({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem 
}: {
  items: CartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
}) {
  return (
    <div className="p-4 space-y-4">
      {items.map((item) => (
        <Card key={item.productId} className="p-4">
          <CardContent className="p-0">
            <div className="flex space-x-4">
              {/* Product Image */}
              <div className="relative w-16 h-16 flex-shrink-0">
                {item.product.image_url ? (
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-md"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2 mb-1">
                  {item.product.name}
                </h4>
                
                <p className="text-sm font-semibold text-primary mb-2">
                  {new Intl.NumberFormat('de-CH', {
                    style: 'currency',
                    currency: 'CHF',
                  }).format(item.product.price / 100)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onRemoveItem(item.productId)}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Artikel entfernen</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Cart Footer with Total and Checkout
function CartFooter({ 
  total, 
  onClearCart, 
  onClose 
}: {
  total: string
  onClearCart: () => void
  onClose: () => void
}) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const items = useCartStore((state) => state.items)

  // KISS: Simple checkout handler (NextJS 15 compatible)
  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsCheckingOut(true)
    setCheckoutError(null)

    try {
      // Server Action call - automatically redirects to Stripe
      await createCheckoutSession(items)
      // Note: This line won't be reached if redirect() succeeds
    } catch (error: any) {
      // NextJS 15: redirect() throws with digest 'NEXT_REDIRECT'
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        // This is a normal redirect, not an error - let it bubble up
        throw error
      }
      
      // Only catch actual errors
      console.error('Checkout error:', error)
      setCheckoutError(error instanceof Error ? error.message : 'Checkout fehlgeschlagen')
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="border-t p-6 space-y-4">
      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-base font-medium">Gesamtbetrag:</span>
        <span className="text-lg font-bold">{total}</span>
      </div>
      
      <Separator />

      {/* Error message */}
      {checkoutError && (
        <div className="rounded-lg bg-red-50 p-3">
          <p className="text-sm text-red-700">{checkoutError}</p>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleCheckout}
          disabled={isCheckingOut || items.length === 0}
        >
          {isCheckingOut ? 'Weiterleitung...' : 'Zur Kasse'}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onClose}
          asChild
        >
          <Link href="/shop">
            Weiter einkaufen
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full text-destructive hover:text-destructive"
          onClick={onClearCart}
        >
          Warenkorb leeren
        </Button>
      </div>
    </div>
  )
}