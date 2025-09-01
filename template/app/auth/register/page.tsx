import { Suspense } from 'react';
import { requireNoAuth } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function RegisterPage() {
  // Redirect if already authenticated
  await requireNoAuth();

  return (
    <div className="py-16">
      <Container size="sm">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Konto erstellen</CardTitle>
              <CardDescription>
                Legen Sie Ihr Konto an
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Laden...</div>}>
                <SignUpForm />
              </Suspense>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Bereits ein Konto?{' '}
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