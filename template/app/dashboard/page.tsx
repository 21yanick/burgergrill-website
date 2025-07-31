/**
 * 🏪 RESTAURANT DASHBOARD OVERVIEW
 * Restaurant Management focused dashboard for business owners
 * 
 * Features:
 * - Live restaurant status (open/closed)
 * - Current special hours (holidays/vacations)
 * - Quick actions for management tasks
 * - Restaurant business information
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Calendar, 
  Settings, 
  Store, 
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  CalendarX,
  Edit3
} from 'lucide-react';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth/server';
import { getRestaurantStatus } from '@/lib/restaurant/actions/opening-hours';
import { getActiveSpecialHours, getUpcomingSpecialHours } from '@/lib/restaurant/actions/special-hours';

export default async function DashboardPage() {
  // Server-side authentication and data fetching
  const user = await requireAuth();

  // Fetch restaurant data server-side for better performance
  let restaurantStatus = null;
  let activeSpecialHours = null;
  let upcomingSpecialHours = [];

  try {
    restaurantStatus = await getRestaurantStatus();
    activeSpecialHours = await getActiveSpecialHours();  
    upcomingSpecialHours = await getUpcomingSpecialHours();
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    // Continue rendering with empty data - graceful degradation
  }

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <>
      {/* Restaurant Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Current Status */}
        <Card className={restaurantStatus?.isOpen 
          ? 'border-emerald-500/20 bg-emerald-500/10 dark:border-emerald-400/30 dark:bg-emerald-400/10' 
          : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'
        }>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restaurant Status</CardTitle>
            {restaurantStatus?.isOpen ? (
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${restaurantStatus?.isOpen 
              ? 'text-emerald-700 dark:text-emerald-300' 
              : 'text-slate-700 dark:text-slate-300'
            }`}>
              {restaurantStatus?.isOpen ? 'Geöffnet' : 'Geschlossen'}
            </div>
            <p className="text-xs text-muted-foreground">
              {restaurantStatus?.todayHours ? (
                `Heute: ${formatTime(restaurantStatus.todayHours.open_time)} - ${formatTime(restaurantStatus.todayHours.close_time)}`
              ) : (
                'Heute geschlossen'
              )}
            </p>
          </CardContent>
        </Card>

        {/* Active Special Hours */}
        <Card className={activeSpecialHours 
          ? 'border-amber-500/20 bg-amber-500/10 dark:border-amber-400/30 dark:bg-amber-400/10' 
          : ''
        }>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktuelle Ferien</CardTitle>
            <CalendarX className={`h-4 w-4 ${activeSpecialHours 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-muted-foreground'
            }`} />
          </CardHeader>
          <CardContent>
            {activeSpecialHours ? (
              <>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">Aktiv</div>
                <p className="text-xs text-muted-foreground">
                  {activeSpecialHours.custom_message}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">Normal</div>
                <p className="text-xs text-muted-foreground">
                  Keine aktiven Ferien
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Special Hours */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geplante Ferien</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSpecialHours.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingSpecialHours.length > 0 
                ? `Nächste: ${new Date(upcomingSpecialHours[0].date_start).toLocaleDateString('de-DE')}`
                : 'Keine geplanten Ferien'
              }
            </p>
          </CardContent>
        </Card>
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
                  Wochentliche Öffnungszeiten verwalten
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
            
            {restaurantStatus?.restaurantName && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Restaurant</p>
                <p className="text-sm text-muted-foreground">{restaurantStatus.restaurantName}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}