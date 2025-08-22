'use client'

/**
 * 🚨 OPENING HOURS ERROR BOUNDARY
 * Route-specific error boundary for opening hours management
 * 
 * Features:
 * - Client-side error boundary for opening hours route
 * - German localization with contextual messaging
 * - Recovery actions specific to opening hours workflow
 * - Consistent UI with dashboard design system
 */

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// =====================================================================================
// ERROR BOUNDARY INTERFACE
// =====================================================================================

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// =====================================================================================
// OPENING HOURS ERROR BOUNDARY
// =====================================================================================

export default function OpeningHoursError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error for debugging (could be sent to monitoring service)
    console.error('Opening Hours Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2 text-destructive">
            <Clock className="w-5 h-5" />
            Fehler beim Laden der Öffnungszeiten
          </CardTitle>
          <CardDescription className="text-center">
            Die Öffnungszeiten konnten nicht geladen werden. Dies könnte an einer temporären Verbindungsstörung liegen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Details */}
          <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
            {error.digest && (
              <div>Error ID: {error.digest}</div>
            )}
            <div className="text-red-600">
              {error.message || 'Ein unbekannter Fehler ist aufgetreten.'}
            </div>
          </div>
          
          {/* Recovery Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Erneut versuchen
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/dashboard/opening-hours">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück zum Dashboard
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Falls das Problem weiterhin besteht, kontaktieren Sie den Support oder versuchen Sie es später erneut.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}