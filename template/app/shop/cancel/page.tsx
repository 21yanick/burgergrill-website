/**
 * 🟩 SHOP-ONLY: Checkout Cancel Page
 * KISS: Simple cancellation message
 */

import Link from 'next/link'
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Simple cancel page with clear next steps
export default function CancelPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <XCircle className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl">Bezahlung abgebrochen</CardTitle>
            <CardDescription>
              Ihre Bestellung wurde nicht abgeschlossen. Die Artikel bleiben in Ihrem Warenkorb.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Information note */}
            <div className="rounded-lg bg-orange-50 p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  Bezahlung abgebrochen
                </span>
              </div>
              <p className="mt-1 text-sm text-orange-700">
                Es wurde keine Zahlung verarbeitet. Ihre Artikel sind weiterhin verfügbar.
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-4">
              <Button asChild className="w-full" size="lg">
                <Link href="/shop">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück zum Warenkorb
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/shop">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Weiter einkaufen
                </Link>
              </Button>
            </div>

            {/* Help section */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Probleme bei der Bezahlung?
              </p>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/contact">
                  Kontakt aufnehmen
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Bezahlung abgebrochen',
  description: 'Die Bezahlung wurde abgebrochen. Ihre Artikel bleiben im Warenkorb.',
}