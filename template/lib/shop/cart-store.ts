/**
 * 🟩 SHOP-ONLY: Shopping Cart Store
 * Zustand + Persist für Shopping Cart State Management (2025 Best Practice)
 * Fixed: Infinite loops & SSR hydration issues
 */

import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types für Cart Items
export interface CartItem {
  productId: string
  product: {
    id: string
    name: string
    price: number // in Rappen (CHF cents)
    image_url?: string
    description?: string
    digital: boolean // 🎯 KISS: For automatic shipping detection
  }
  quantity: number
  addedAt: Date
}

// Cart State Interface
interface CartState {
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (product: CartItem['product'], quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  
  // Computed helpers (no getters to avoid infinite loops)
  getItemCount: () => number
  getTotal: () => number
  getTotalInCHF: () => string
}

// Zustand Store mit Persist Middleware
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      // Add item to cart
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            item => item.productId === product.id
          )
          
          if (existingIndex > -1) {
            // Update existing item quantity
            const newItems = [...state.items]
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity
            }
            return { items: newItems }
          } else {
            // Add new item
            const newItem: CartItem = {
              productId: product.id,
              product,
              quantity,
              addedAt: new Date()
            }
            return { 
              items: [...state.items, newItem],
              isOpen: true // Auto-open cart when adding
            }
          }
        })
      },
      
      // Remove item completely
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId)
        }))
      },
      
      // Update item quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          )
        }))
      },
      
      // Clear all items
      clearCart: () => {
        set({ items: [], isOpen: false })
      },
      
      // Cart visibility
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      // Computed helpers (functions instead of getters to avoid infinite loops)
      getItemCount: () => {
        const state = get()
        return state.items.reduce((count, item) => count + item.quantity, 0)
      },
      
      getTotal: () => {
        const state = get()
        return state.items.reduce(
          (total, item) => total + (item.product.price * item.quantity), 
          0
        )
      },
      
      getTotalInCHF: () => {
        const state = get()
        const totalInRappen = state.items.reduce(
          (total, item) => total + (item.product.price * item.quantity), 
          0
        )
        const totalInCHF = totalInRappen / 100
        
        return new Intl.NumberFormat('de-CH', {
          style: 'currency',
          currency: 'CHF',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(totalInCHF)
      }
    }),
    {
      name: 'shopping-cart', // localStorage key
      partialize: (state) => ({ 
        items: state.items // Only persist items, not UI state
      }),
      // SSR-safe configuration
      skipHydration: true,
    }
  )
)

// Helper hook for cart item count (for header icon)
export function useCartItemCount() {
  return useCartStore((state) => state.getItemCount())
}

// Helper hooks for cart visibility (individual selectors to avoid object recreation)
export function useCartOpen() {
  const isOpen = useCartStore((state) => state.isOpen)
  const openCart = useCartStore((state) => state.openCart)
  const closeCart = useCartStore((state) => state.closeCart)
  const toggleCart = useCartStore((state) => state.toggleCart)
  
  return { isOpen, openCart, closeCart, toggleCart }
}

// Individual hooks for better performance
export const useCartIsOpen = () => useCartStore((state) => state.isOpen)
export const useCartActions = () => useCartStore((state) => ({
  openCart: state.openCart,
  closeCart: state.closeCart,
  toggleCart: state.toggleCart,
}))

// Hook for total price
export const useCartTotal = () => useCartStore((state) => state.getTotalInCHF())

// SSR-safe hydration hook
export function useCartHydration() {
  const [isHydrated, setIsHydrated] = useState(false)
  
  useEffect(() => {
    // Manually trigger hydration after mount
    useCartStore.persist.rehydrate()
    setIsHydrated(true)
  }, [])
  
  return isHydrated
}