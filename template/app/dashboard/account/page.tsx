/**
 * 👤 ACCOUNT DASHBOARD PAGE
 * User account management including password changes
 * 
 * Features:
 * - Server-side authentication with automatic redirect
 * - Password change functionality
 * - Account information display
 * - Clean KISS implementation
 */

import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, Info } from 'lucide-react';
import Link from 'next/link';

import { ChangePasswordForm } from '@/components/dashboard/account/change-password-form';

// =====================================================================================
// METADATA
// =====================================================================================

export const metadata: Metadata = {
  title: 'Account verwalten | Burgergrill Dashboard',
  description: 'Verwalten Sie Ihr Account und ändern Sie Ihr Passwort sicher.',
  robots: 'noindex, nofollow', // Dashboard pages should not be indexed
};

// =====================================================================================
// ACCOUNT DASHBOARD PAGE
// =====================================================================================

export default async function AccountPage() {
  // Server-side authentication - redirects to login if not authenticated
  const user = await requireAuth();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Account-Einstellungen und Sicherheit
        </p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Ihre Account-Details im Überblick
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">E-Mail Adresse</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Registriert seit</p>
              <p className="text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Passwort ändern
          </CardTitle>
          <CardDescription>
            Ändern Sie Ihr Passwort für mehr Sicherheit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            Sicherheitshinweise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div>
              <span className="font-medium">🔒 Passwort:</span>
              <span className="text-muted-foreground ml-1">Mindestens 6 Zeichen erforderlich</span>
            </div>
            <div>
              <span className="font-medium">🔄 Automatisch:</span>
              <span className="text-muted-foreground ml-1">Änderung sofort wirksam</span>
            </div>
            <div>
              <span className="font-medium">📧 E-Mail:</span>
              <span className="text-muted-foreground ml-1">E-Mail Adresse kann nicht geändert werden</span>
            </div>
            <div>
              <span className="font-medium">🔐 Session:</span>
              <span className="text-muted-foreground ml-1">Bleibt nach Passwort-Änderung bestehen</span>
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
                href="/dashboard/opening-hours" 
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