/**
 * 🟩 SHOP-ONLY: Order Details Page  
 * Shop Owner Dashboard - View and manage single order
 * KISS Implementation with status updates
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  User, 
  CreditCard, 
  MapPin,
  Mail,
  ExternalLink
} from 'lucide-react'
import { StatusSelect } from '@/components/dashboard'

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

// Fetch single order with items
async function getOrder(orderId: string) {
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
    .eq('id', orderId)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data
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

// Check if order has physical products (needs shipping)
function hasPhysicalProducts(orderItems: any[]): boolean {
  // For now, assume all products might need shipping
  // In a real implementation, you'd check product.digital field
  return orderItems && orderItems.length > 0
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const { id } = await params
  const order = await getOrder(id)
  
  if (!order) {
    notFound()
  }

  const needsShipping = hasPhysicalProducts(order.order_items)
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Bestellung #{order.id.slice(-8)}
            </h1>
            <p className="text-muted-foreground">
              {formatSwissDate(order.created_at)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant={getStatusColor(order.status)} className="text-sm">
            {getStatusLabel(order.status)}
          </Badge>
          <span className="text-2xl font-bold">
            {formatCHF(order.total_amount)}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Kunde
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{order.email}</span>
            </div>
            
            {order.stripe_session_id && (
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Stripe Session:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {order.stripe_session_id.slice(-12)}
                </code>
              </div>
            )}
            
            {needsShipping && order.shipping_address && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Versandadresse:</span>
                </div>
                <div className="text-sm text-muted-foreground ml-6">
                  {/* TODO: Format shipping address properly */}
                  <pre className="text-xs">
                    {JSON.stringify(order.shipping_address, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Bestellverwaltung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status ändern:</label>
              <StatusSelect 
                orderId={order.id} 
                currentStatus={order.status}
              />
            </div>
            
            <Separator />
            
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Erstellt:</span>
                <span>{formatSwissDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span>Aktualisiert:</span>
                <span>{formatSwissDate(order.updated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span>Artikel:</span>
                <span>{order.order_items?.length || 0}</span>
              </div>
            </div>
            
            {order.stripe_session_id && (
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a 
                  href={`https://dashboard.stripe.com/test/payments/${order.stripe_payment_intent_id || order.stripe_session_id}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Stripe Dashboard öffnen
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Bestellte Artikel</CardTitle>
          <CardDescription>
            Übersicht aller in dieser Bestellung enthaltenen Produkte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {order.order_items && order.order_items.length > 0 ? (
            <div className="space-y-4">
              {order.order_items.map((item: any, index: number) => (
                <div key={item.id || index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{item.product_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity}x {formatCHF(item.unit_price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCHF(item.total_price)}</p>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Gesamtbetrag:</span>
                <span>{formatCHF(order.total_amount)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Keine Artikel gefunden
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  return {
    title: `Bestellung #${id.slice(-8)} - Dashboard`,
    description: 'Bestelldetails verwalten und Status aktualisieren',
  }
}