import { Suspense } from 'react';
import { requireNoAuth } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function ResetPage() {
  // Redirect if already authenticated
  await requireNoAuth();

  return (
    <div className="py-16">
      <Container size="sm">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Passwort zurücksetzen</CardTitle>
              <CardDescription>
                Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Laden...</div>}>
                <ResetPasswordForm />
              </Suspense>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Passwort wieder eingefallen?{' '}
                  <Link 
                    href="/auth/login" 
                    className="text-primary hover:underline"
                  >
                    Anmelden
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}