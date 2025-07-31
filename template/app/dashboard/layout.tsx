/**
 * Dashboard Layout - Server Component
 * Handles authentication and provides clean dashboard shell
 */

import { requireAuth } from '@/lib/auth/server';
import { Container } from '@/components/ui/container';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LayoutDashboard, Settings } from 'lucide-react';
import { LogoutButton } from '@/components/dashboard/logout-button';
import { ThemeToggle } from '@/components/theme';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication - redirects to login if not authenticated
  await requireAuth();

  return (
    <div className="pt-24 pb-8">
      <Container>
        <div className="space-y-8">
          {/* Dashboard Navigation */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Verwalten Sie Ihr Konto und Restaurant
              </p>
            </div>
            
            {/* Quick Navigation */}
            <div className="flex items-center gap-2">
              {/* ✅ SHARED: Dashboard Overview */}
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Übersicht
                </Link>
              </Button>
              
              {/* ✅ THEME: Dark/Light Mode Toggle */}
              <ThemeToggle />
              
              {/* ✅ LOGOUT: Secure logout from dashboard */}
              <LogoutButton />
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}