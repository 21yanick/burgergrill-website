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

import React from 'react';
import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Öffnungszeiten</h1>
              <p className="text-muted-foreground">
                Verwalten Sie die wöchentlichen Öffnungszeiten Ihres Restaurants
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </Button>
        </div>
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

// =====================================================================================
// ERROR BOUNDARY (Next.js 13+ App Router)
// =====================================================================================

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Clock className="w-5 h-5" />
            Fehler beim Laden
          </CardTitle>
          <CardDescription>
            Die Öffnungszeiten konnten nicht geladen werden.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error.message || 'Ein unbekannter Fehler ist aufgetreten.'}
          </p>
          
          <div className="flex gap-2">
            <Button onClick={reset} size="sm">
              Erneut versuchen
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                Zurück zum Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}