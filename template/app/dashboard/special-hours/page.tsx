/**
 * 🏖️ SPECIAL HOURS DASHBOARD PAGE
 * Simple KISS-principle dashboard for restaurant holiday management
 * 
 * What this page does:
 * - Restaurant owner can mark "closed from X to Y - vacation!"
 * - Simple, no over-engineering
 * - Mobile responsive
 * - German localized
 */ 

import { requireAuth } from '@/lib/auth/server';
import { HolidayManager } from '@/components/dashboard/special-hours/holiday-manager';
import type { Metadata } from 'next';

// =====================================================================================
// METADATA & SEO
// =====================================================================================

export const metadata: Metadata = {
  title: 'Ferien & Feiertage | Dashboard',
  description: 'Verwalten Sie Ihre Betriebsferien und Feiertage - einfach und unkompliziert',
  robots: 'noindex, nofollow', // Dashboard is private
};

// =====================================================================================
// DASHBOARD PAGE
// =====================================================================================

export default async function SpecialHoursPage() {
  // Server-side authentication check
  await requireAuth();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Ferien & Feiertage
        </h1>
        <p className="text-muted-foreground">
          Markieren Sie Zeiträume als geschlossen und informieren Sie Ihre Kunden
        </p>
      </div>

      {/* Holiday Manager */}
      <HolidayManager />
    </div>
  );
}