/**
 * 🟩 SHOP-ONLY: Dashboard Server Actions
 * KISS Implementation for order management
 */

'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireAuth } from '@/lib/auth/server'
import { revalidatePath } from 'next/cache'
import { resend } from '@/lib/email/client'
import { OrderStatusEmail } from '@/lib/email/templates'

// Create Supabase client for server actions
async function createClient() {
  await requireAuth() // Ensure user is authenticated (= shop owner)
  
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // Not needed in server actions
        },
      },
    }
  )
}

// Update order status
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'completed']
    if (!validStatuses.includes(newStatus)) {
      return { error: 'Ungültiger Status' }
    }

    const supabase = await createClient()
    
    // Get current order data for email
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('status, email, total_amount, created_at, shipping_address')
      .eq('id', orderId)
      .single()
    
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
    
    if (error) {
      console.error('Order status update error:', error)
      return { error: 'Fehler beim Aktualisieren des Status' }
    }
    
    // 🟩 SHOP-ONLY: Send status update email (KISS implementation)
    try {
      if (currentOrder?.email && currentOrder.status !== newStatus) {
        const hasShipping = currentOrder.shipping_address ? true : false
        
        await resend.emails.send({
          from: `Shop <noreply@${process.env.EMAIL_DOMAIN || 'localhost'}>`,
          to: currentOrder.email,
          subject: `Bestellung #${orderId.slice(-8)} - Status aktualisiert`,
          react: OrderStatusEmail({
            customerEmail: currentOrder.email,
            orderId: orderId,
            oldStatus: currentOrder.status,
            newStatus: newStatus,
            totalAmount: currentOrder.total_amount,
            orderDate: currentOrder.created_at,
            hasShipping: hasShipping,
          }),
        })
        
        console.log(`Status update email sent for order ${orderId} to ${currentOrder.email}`)
      }
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError)
      // Don't fail the status update if email fails
    }
    
    // Revalidate pages that show order data
    revalidatePath('/dashboard/orders')
    revalidatePath(`/dashboard/orders/${orderId}`)
    
    return { success: true }
  } catch (err) {
    console.error('Order status update error:', err)
    return { error: 'Unerwarteter Fehler beim Aktualisieren' }
  }
}

// Get orders summary for dashboard
export async function getOrdersSummary() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select('status, total_amount')
    
    if (error) {
      console.error('Orders summary error:', error)
      return { error: 'Fehler beim Laden der Bestellungsübersicht' }
    }
    
    // Calculate summary statistics
    const summary = {
      total: data.length,
      pending: data.filter(o => o.status === 'pending').length,
      processing: data.filter(o => o.status === 'processing').length,
      shipped: data.filter(o => o.status === 'shipped').length,
      completed: data.filter(o => o.status === 'completed').length,
      totalRevenue: data.reduce((sum, order) => sum + order.total_amount, 0),
    }
    
    return { data: summary }
  } catch (err) {
    console.error('Orders summary error:', err)
    return { error: 'Unerwarteter Fehler beim Laden der Übersicht' }
  }
}