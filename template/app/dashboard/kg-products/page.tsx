/**
 * 🥩 KG-PRODUKTE DASHBOARD PAGE
 * Dashboard route for managing KG-Verkauf products
 * 
 * Features:
 * - Server-side authentication with automatic redirect
 * - Product management interface (prices, availability)
 * - Real-time data synchronization
 * - SEO-optimized metadata
 * - Error boundaries for graceful error handling
 */

import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Info } from 'lucide-react';
import Link from 'next/link';

import { KgProductsManager } from '@/components/dashboard/kg-products/kg-products-manager';

// =====================================================================================
// METADATA
// =====================================================================================

export const metadata: Metadata = {
  title: 'KG-Produkte verwalten | Burgergrill Dashboard',
  description: 'Verwalten Sie Ihre KG-Verkauf Produkte. Preise und Verfügbarkeit können einfach angepasst werden.',
  robots: 'noindex, nofollow', // Dashboard pages should not be indexed
};

// =====================================================================================
// KG-PRODUCTS DASHBOARD PAGE
// =====================================================================================

export default async function KgProductsPage() {
  // Server-side authentication - redirects to login if not authenticated
  const user = await requireAuth();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">KG-Produkte</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Preise und Verfügbarkeit Ihrer KG-Verkauf Produkte
        </p>
      </div>

      {/* Products Manager */}
      <KgProductsManager />

      {/* Help Section */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            Hilfe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div>
              <span className="font-medium">💰 Preise:</span>
              <span className="text-muted-foreground ml-1">CHF pro kg oder pack</span>
            </div>
            <div>
              <span className="font-medium">📦 Einheiten:</span>
              <span className="text-muted-foreground ml-1">kg (Kilogramm), pack (Packung), stk (Stück)</span>
            </div>
            <div>
              <span className="font-medium">✅ Verfügbarkeit:</span>
              <span className="text-muted-foreground ml-1">Toggle um Produkte aus/einzublenden</span>
            </div>
            <div>
              <span className="font-medium">🔄 Live:</span>
              <span className="text-muted-foreground ml-1">Sofort auf Website sichtbar</span>
            </div>
            <div>
              <span className="font-medium">📝 Grund:</span>
              <span className="text-muted-foreground ml-1">Optional: Grund für Nichtverfügbarkeit</span>
            </div>
            <div>
              <span className="font-medium">💾 Speichern:</span>
              <span className="text-muted-foreground ml-1">Änderungen mit Save-Button speichern</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer with User Info */}
      <Card className="bg-background border-muted">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span>Angemeldet als {user.email}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website anzeigen →
              </Link>
              <Link 
                href="/dashboard" 
                className="hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}