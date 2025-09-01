'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Global error captured:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle>Oops! Etwas ist schiefgelaufen</CardTitle>
          <CardDescription>
            Wir sind auf einen unerwarteten Fehler gestossen. Unser Team wurde benachrichtigt und arbeitet an einer Lösung.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
            Error ID: {error.digest || 'Unknown'}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Erneut versuchen
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Zur Startseite
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}