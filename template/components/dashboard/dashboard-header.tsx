/**
 * 📊 DASHBOARD HEADER - Modern Navigation Component
 * Clean dashboard navigation with active states and user controls
 * 
 * Features:
 * - Navigation with usePathname active states
 * - Theme toggle for dark/light mode
 * - User menu with profile and logout
 * - Mobile-responsive hamburger menu
 * - KISS design principles
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { 
  LayoutDashboard, 
  Clock, 
  CalendarX, 
  ShoppingCart,
  Settings,
  Menu,
  X,
  ExternalLink,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme';
import { LogoutButton } from '@/components/dashboard/logout-button';

// =====================================================================================
// NAVIGATION CONFIGURATION
// =====================================================================================

const navigationItems = [
  {
    title: 'Öffnungszeiten',
    href: '/dashboard/opening-hours',
    icon: Clock,
    exact: false,
  },
  {
    title: 'Ferien & Feiertage',
    href: '/dashboard/special-hours',
    icon: CalendarX,
    exact: false,
  },
  {
    title: 'KG-Produkte',
    href: '/dashboard/kg-products',
    icon: ShoppingCart,
    exact: false,
  },
  {
    title: 'Konto',
    href: '/dashboard/account',
    icon: User,
    exact: false,
  },
] as const;

// =====================================================================================
// DASHBOARD HEADER COMPONENT
// =====================================================================================

export function DashboardHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if navigation item is active
  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand + Navigation */}
          <div className="flex items-center gap-6">
            {/* Dashboard Brand */}
            <Link href="/dashboard/opening-hours" className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <LayoutDashboard className="h-4 w-4 text-primary" />
              </div>
              <span className="hidden sm:inline-block">Dashboard</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);
                
                return (
                  <Button
                    key={item.href}
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    asChild
                    className={cn(
                      "gap-2 transition-colors",
                      active && "bg-muted font-medium"
                    )}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-2">
            {/* Website Link */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-2"
            >
              <Link 
                href="/" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline-block">Website</span>
              </Link>
            </Button>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Logout Button */}
            <LogoutButton />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="md:hidden"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t md:hidden">
            <nav className="flex flex-col gap-1 py-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);
                
                return (
                  <Button
                    key={item.href}
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    asChild
                    className={cn(
                      "gap-2 justify-start transition-colors",
                      active && "bg-muted font-medium"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                );
              })}
              
              {/* Website Link for Mobile */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-2 justify-start transition-colors border-t pt-3 mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link 
                  href="/" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Website anzeigen
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}

// =====================================================================================
// EXPORT
// =====================================================================================

export default DashboardHeader;