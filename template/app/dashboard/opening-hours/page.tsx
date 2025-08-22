/**
 * 🕒 OPENING HOURS DASHBOARD PAGE
 * Dashboard route for managing restaurant opening hours
 * 
 * Features:
 * - Server-side authentication with automatic redirect
 * - Weekly opening hours management interface  
 * - Real-time data synchronization
 * - SEO-optimized metadata
 * - Error boundaries for graceful error handling
 */

import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Info } from 'lucide-react';
import Link from 'next/link';

import { WeeklyEditor } from '@/components/dashboard/opening-hours/weekly-editor';

// =====================================================================================
// METADATA
// =====================================================================================

export const metadata: Metadata = {
  title: 'Öffnungszeiten verwalten | Burgergrill Dashboard',
  description: 'Verwalten Sie die wöchentlichen Öffnungszeiten Ihres Restaurants. Änderungen werden automatisch auf der Website aktualisiert.',
  robots: 'noindex, nofollow', // Dashboard pages should not be indexed
};

// =====================================================================================
// OPENING HOURS DASHBOARD PAGE
// =====================================================================================

export default async function OpeningHoursPage() {
  // Server-side authentication - redirects to login if not authenticated
  const user = await requireAuth();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Öffnungszeiten</h1>
        <p className="text-muted-foreground">
          Verwalten Sie die wöchentlichen Öffnungszeiten Ihres Restaurants
        </p>
      </div>


      {/* Weekly Editor */}
      <WeeklyEditor />

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
              <span className="font-medium">⏰ Zeitformat:</span>
              <span className="text-muted-foreground ml-1">24h Format (11:00, 22:00)</span>
            </div>
            <div>
              <span className="font-medium">💾 Speichern:</span>
              <span className="text-muted-foreground ml-1">Änderungen mit Save-Button speichern</span>
            </div>
            <div>
              <span className="font-medium">📱 Heute:</span>
              <span className="text-muted-foreground ml-1">Aktueller Tag wird hervorgehoben</span>
            </div>
            <div>
              <span className="font-medium">🔄 Live:</span>
              <span className="text-muted-foreground ml-1">Sofort auf Website sichtbar</span>
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
                href="/dashboard/opening-hours" 
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

