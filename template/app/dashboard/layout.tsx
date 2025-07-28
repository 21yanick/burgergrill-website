/**
 * Dashboard Layout - Server Component
 * Handles authentication and provides clean dashboard shell
 */

import { requireAuth } from '@/lib/auth/server';
import { Container } from '@/components/ui/container';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard, LayoutDashboard, Settings, Package } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication - redirects to login if not authenticated
  await requireAuth();

  return (
    <div className="py-8">
      <Container>
        <div className="space-y-8">
          {/* Dashboard Navigation */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your account and business operations
              </p>
            </div>
            
            {/* Quick Navigation */}
            <div className="flex items-center gap-2">
              {/* ✅ SHARED: Dashboard Overview */}
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Overview
                </Link>
              </Button>
              
              {/* 🟩 SHOP-ONLY: Orders Management */}
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/orders">
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </Link>
              </Button>
              
              {/* 🟦 SAAS-ONLY: Subscription Management (for shop: delete this button) */}
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/subscription">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Subscription
                </Link>
              </Button>
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