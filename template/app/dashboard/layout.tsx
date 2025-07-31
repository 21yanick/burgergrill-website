/**
 * 📊 DASHBOARD LAYOUT - Next.js 15 Modern Architecture
 * Clean dashboard layout with dedicated header and authentication
 * 
 * Features:
 * - Server-side authentication check
 * - Dedicated dashboard header with navigation
 * - Container-based content layout
 * - Mobile-responsive design
 */

import { requireAuth } from '@/lib/auth/server';
import { Container } from '@/components/ui/container';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication - redirects to login if not authenticated
  await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header - Navigation, Theme, User Controls */}
      <DashboardHeader />
      
      {/* Main Dashboard Content */}
      <main className="pb-8">
        <Container>
          <div className="py-8">
            {children}
          </div>
        </Container>
      </main>
    </div>
  );
}