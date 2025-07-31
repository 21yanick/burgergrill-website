/**
 * 🏪 RESTAURANT DASHBOARD OVERVIEW
 * Clean management dashboard for business owners
 * 
 * Features:
 * - Quick actions for management tasks
 * - Restaurant business information
 * - User account details
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Settings, 
  Store,
  CalendarX
} from 'lucide-react';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth/server';

export default async function DashboardPage() {
  // Server-side authentication
  const user = await requireAuth();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Restaurant Übersicht</h1>
        <p className="text-muted-foreground">
          Schnelle Aktionen und Verwaltung für Ihr Restaurant
        </p>
      </div>


      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Restaurant Management
          </CardTitle>
          <CardDescription>
            Schnelle Aktionen für Ihr Restaurant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <Link href="/dashboard/opening-hours">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Öffnungszeiten</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Wöchentliche Öffnungszeiten verwalten
                </p>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <Link href="/dashboard/special-hours">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarX className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Ferien & Feiertage</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Geschlossene Tage mit Kundennachricht
                </p>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Restaurant Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Restaurant Information
          </CardTitle>
          <CardDescription>
            Ihr Restaurant auf einen Blick
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Account</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Registriert seit</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString('de-DE')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}