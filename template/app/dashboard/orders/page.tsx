/**
 * 🟩 SHOP-ONLY: Orders Management Page
 * Shop Owner Dashboard - View and manage all orders
 * KISS Implementation with Swiss formatting
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Package, Calendar, User, CreditCard } from 'lucide-react'
import type { Order } from '@/types/database'

// Create Supabase client for server components
async function createClient() {
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
          // Not needed in server components
        },
      },
    }
  )
}

// Fetch all orders with order items
async function getOrders(): Promise<Order[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        product_name,
        quantity,
        unit_price,
        total_price
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100) // KISS: Simple pagination
  
  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  
  return data || []
}

// Swiss date formatting
function formatSwissDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-CH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Swiss CHF formatting
function formatCHF(amountInRappen: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(amountInRappen / 100)
}

// Status badge colors
function getStatusColor(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'pending': return 'outline'
    case 'processing': return 'secondary' 
    case 'shipped': return 'default'
    case 'completed': return 'secondary'
    default: return 'outline'
  }
}

// Status display names (German)
function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending': return 'Ausstehend'
    case 'processing': return 'In Bearbeitung'
    case 'shipped': return 'Versendet'
    case 'completed': return 'Abgeschlossen'
    default: return status
  }
}

// Main page component
export default async function OrdersPage() {
  const orders = await getOrders()
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bestellungen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie alle Kundenbestellungen und Versände
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {orders.length} Bestellungen
        </Badge>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Keine Bestellungen</h3>
            <p className="text-sm text-muted-foreground text-center">
              Es sind noch keine Bestellungen eingegangen.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order: any) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-medium">
                      Bestellung #{order.id.slice(-8)}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {order.email}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatSwissDate(order.created_at)}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <span className="text-lg font-semibold">
                      {formatCHF(order.total_amount)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Package className="h-3 w-3" />
                    <span>
                      {order.order_items?.length || 0} Artikel
                    </span>
                    {order.stripe_session_id && (
                      <>
                        <span>•</span>
                        <CreditCard className="h-3 w-3" />
                        <span>Bezahlt</span>
                      </>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Eye className="h-3 w-3 mr-2" />
                      Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export const metadata = {
  title: 'Bestellungen - Dashboard',
  description: 'Verwalten Sie alle Kundenbestellungen und Versände',
}