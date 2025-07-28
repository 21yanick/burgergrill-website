import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/config'
import { createServerClient } from '@supabase/ssr'
import { getLogger } from '@/lib/logger'
import { resend } from '@/lib/email/client'
import { OrderConfirmationEmail } from '@/lib/email/templates'
import Stripe from 'stripe'

const logger = getLogger('stripe-webhook')

// Create Supabase client with service role for webhook operations
function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() { },
      },
    }
  )
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    logger.error('Missing Stripe signature')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    logger.error({ error }, 'Invalid webhook signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        logger.info({ subscriptionId: subscription.id }, 'Processing subscription event')

        // Get customer to find user
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        if (!customer || customer.deleted) {
          logger.error({ customerId: subscription.customer }, 'Customer not found')
          break
        }

        // Find user by email
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', (customer as Stripe.Customer).email)
          .single()

        if (!profile) {
          logger.error({ email: (customer as Stripe.Customer).email }, 'User profile not found')
          break
        }

        // Upsert subscription
        const firstItem = subscription.items.data[0]
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: profile.id,
            stripe_subscription_id: subscription.id,
            stripe_price_id: firstItem?.price.id,
            status: subscription.status,
            current_period_start: firstItem?.current_period_start 
              ? new Date(firstItem.current_period_start * 1000).toISOString()
              : null,
            current_period_end: firstItem?.current_period_end
              ? new Date(firstItem.current_period_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          })

        if (error) {
          logger.error({ error, subscriptionId: subscription.id }, 'Failed to update subscription')
          throw error
        }

        // Update profile with customer ID if not set
        if (!(customer as Stripe.Customer).metadata?.user_id) {
          await supabase
            .from('profiles')
            .update({ stripe_customer_id: customer.id })
            .eq('id', profile.id)
        }

        logger.info({ subscriptionId: subscription.id, status: subscription.status }, 'Subscription updated')
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        logger.info({ subscriptionId: subscription.id }, 'Processing subscription deletion')

        const { error } = await supabase
          .from('subscriptions')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          logger.error({ error, subscriptionId: subscription.id }, 'Failed to cancel subscription')
          throw error
        }

        logger.info({ subscriptionId: subscription.id }, 'Subscription cancelled')
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        logger.info({ paymentIntentId: paymentIntent.id }, 'Payment succeeded')

        // Handle one-time payments (e.g., for e-commerce)
        if (paymentIntent.metadata?.order_id) {
          const { error } = await supabase
            .from('orders')
            .update({ 
              status: 'paid',
              stripe_payment_intent_id: paymentIntent.id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', paymentIntent.metadata.order_id)

          if (error) {
            logger.error({ error, orderId: paymentIntent.metadata.order_id }, 'Failed to update order')
            throw error
          }

          logger.info({ orderId: paymentIntent.metadata.order_id }, 'Order marked as paid')
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        logger.warn({ paymentIntentId: paymentIntent.id }, 'Payment failed')

        if (paymentIntent.metadata?.order_id) {
          const { error } = await supabase
            .from('orders')
            .update({ 
              status: 'payment_failed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', paymentIntent.metadata.order_id)

          if (error) {
            logger.error({ error, orderId: paymentIntent.metadata.order_id }, 'Failed to update failed order')
          }
        }
        break
      }

      case 'checkout.session.completed': {
        // 🟩 SHOP-ONLY: Handle successful checkout (KISS implementation)
        const session = event.data.object as Stripe.Checkout.Session
        logger.info({ sessionId: session.id }, 'Checkout session completed')

        if (session.mode === 'payment' && session.payment_status === 'paid') {
          try {
            // Retrieve session with line items
            const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
              expand: ['line_items.data.price.product'],
            })

            // Calculate total amount in Rappen (CHF cents)
            const totalAmount = fullSession.amount_total || 0

            // Create order record
            const { data: order, error: orderError } = await supabase
              .from('orders')
              .insert({
                user_id: null, // Guest checkout - no user required
                email: session.customer_details?.email || null,
                total_amount: totalAmount,
                currency: 'CHF',
                status: 'pending', // Start with pending, will be updated to paid after confirmation
                stripe_checkout_session_id: session.id,
                stripe_payment_intent_id: session.payment_intent as string || null,
                shipping_address: session.shipping_details?.address ? {
                  name: session.shipping_details.name,
                  line1: session.shipping_details.address.line1,
                  city: session.shipping_details.address.city,
                  postal_code: session.shipping_details.address.postal_code,
                  country: session.shipping_details.address.country,
                } : null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select('id')
              .single()

            if (orderError) {
              logger.error({ error: orderError, sessionId: session.id }, 'Failed to create order')
              throw orderError
            }

            // Create order items from line items
            if (fullSession.line_items?.data && order) {
              const orderItems = fullSession.line_items.data.map((item, index) => ({
                order_id: order.id,
                product_name: (item.price?.product as Stripe.Product)?.name || `Product ${index + 1}`,
                quantity: item.quantity || 1,
                unit_price: item.price?.unit_amount || 0,
                total_price: (item.price?.unit_amount || 0) * (item.quantity || 1),
              }))

              const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

              if (itemsError) {
                logger.error({ error: itemsError, orderId: order.id }, 'Failed to create order items')
                // Don't throw here - order is already created
              }
            }

            logger.info({ orderId: order.id, sessionId: session.id }, 'Order created successfully')

            // 🟩 SHOP-ONLY: Send order confirmation email (KISS implementation)
            try {
              if (session.customer_details?.email) {
                // Prepare order items data for email
                const emailOrderItems = fullSession.line_items.data.map((item) => ({
                  product_name: (item.price?.product as Stripe.Product)?.name || 'Product',
                  quantity: item.quantity || 1,
                  unit_price: item.price?.unit_amount || 0,
                  total_price: (item.price?.unit_amount || 0) * (item.quantity || 1),
                }))

                // Check if shipping is needed (simple detection)
                const hasShipping = session.shipping_details?.address ? true : false

                await resend.emails.send({
                  from: `Shop <noreply@${process.env.EMAIL_DOMAIN || 'localhost'}>`,
                  to: session.customer_details.email,
                  subject: `Bestellbestätigung #${order.id.slice(-8)}`,
                  react: OrderConfirmationEmail({
                    customerEmail: session.customer_details.email,
                    orderId: order.id,
                    orderItems: emailOrderItems,
                    totalAmount: totalAmount,
                    orderDate: new Date().toISOString(),
                    hasShipping: hasShipping,
                    shippingAddress: session.shipping_details?.address ? {
                      name: session.shipping_details.name || '',
                      line1: session.shipping_details.address.line1 || '',
                      city: session.shipping_details.address.city || '',
                      postal_code: session.shipping_details.address.postal_code || '',
                      country: session.shipping_details.address.country || '',
                    } : undefined,
                  }),
                })

                logger.info({ orderId: order.id, email: session.customer_details.email }, 'Order confirmation email sent')
              }
            } catch (emailError) {
              logger.error({ error: emailError, orderId: order.id }, 'Failed to send order confirmation email')
              // Don't throw - order is already created successfully
            }
          } catch (error) {
            logger.error({ error, sessionId: session.id }, 'Failed to process checkout session')
            // Don't throw - this would return 500 to Stripe and cause retries
          }
        }
        break
      }

      default:
        logger.info({ eventType: event.type }, 'Unhandled webhook event')
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error({ error, eventType: event.type }, 'Webhook processing failed')
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}