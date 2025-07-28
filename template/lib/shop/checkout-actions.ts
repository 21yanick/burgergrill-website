/**
 * 🟩 SHOP-ONLY: Checkout Server Actions
 * KISS: Simple Stripe checkout with CHF + TWINT
 */

'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import type { CartItem } from './cart-store'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
})

// Simple checkout action - one function, minimal complexity (NextJS 15 compatible)
export async function createCheckoutSession(items: CartItem[]) {
  if (!items || items.length === 0) {
    throw new Error('Warenkorb ist leer')
  }

  // Convert cart items to Stripe line items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => ({
    price_data: {
      currency: 'chf',
      product_data: {
        name: item.product.name,
        description: item.product.description,
        images: item.product.image_url ? [
          `${process.env.NEXT_PUBLIC_APP_URL}${item.product.image_url}`
        ] : [],
      },
      unit_amount: item.product.price, // Already in Rappen (CHF cents)
    },
    quantity: item.quantity,
  }))

  // Get current URL for redirects (NextJS 15: await headers())
  const headersList = await headers()
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL

  // 🎯 KISS: Auto-detect if shipping address needed
  const needsShipping = items.some(item => !item.product.digital)

  // Create Stripe checkout session (Swiss-optimized)
  const session = await stripe.checkout.sessions.create({
    mode: 'payment', // One-time payment (not subscription)
    currency: 'chf',
    payment_method_types: ['card', 'twint'], // Swiss payment methods
    line_items: lineItems,
    success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop/cancel`,
    // Guest checkout enabled
    customer_creation: 'if_required',
    // Swiss locale
    locale: 'de',
    // 🎯 AUTOMATIC: Collect shipping address only if needed
    ...(needsShipping && {
      shipping_address_collection: {
        allowed_countries: ['CH'],
      },
    }),
  })

  if (!session.url) {
    throw new Error('Checkout-Session konnte nicht erstellt werden')
  }

  // NextJS 15: redirect() outside try/catch (throws NEXT_REDIRECT internally)
  redirect(session.url)
}

// Helper: Get session details (for success page)
export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session
  } catch (error) {
    console.error('Session retrieval error:', error)
    return null
  }
}