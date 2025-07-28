/**
 * 🟩 SHOP-ONLY: Checkout Success Page
 * KISS: Simple confirmation with cart clearing
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, ShoppingBag, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CartClearOnSuccess } from './cart-clear'

// Simple success page with Swiss UX patterns
export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Bestellung erfolgreich!</CardTitle>
            <CardDescription>
              Vielen Dank für Ihren Einkauf. Ihre Zahlung wurde erfolgreich verarbeitet.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Payment confirmation */}
            <div className="rounded-lg bg-green-50 p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Zahlung bestätigt
                </span>
              </div>
              <p className="mt-1 text-sm text-green-700">
                Ihre Bestellung wird in Kürze bearbeitet.
              </p>
            </div>

            {/* Email confirmation note */}
            <div className="flex items-start space-x-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Bestätigung per E-Mail
                </p>
                <p className="text-sm text-blue-700">
                  Sie erhalten in wenigen Minuten eine E-Mail mit den Bestelldetails.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-4">
              <Button asChild className="w-full" size="lg">
                <Link href="/shop">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Weiter einkaufen
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard">
                  Bestellungen ansehen
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clear cart after successful payment */}
        <Suspense fallback={null}>
          <CartClearOnSuccess />
        </Suspense>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Bestellung erfolgreich',
  description: 'Ihre Bestellung wurde erfolgreich abgeschlossen.',
}