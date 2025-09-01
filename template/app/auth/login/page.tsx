import { Suspense } from 'react';
import { requireNoAuth } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { SignInForm } from '@/components/auth/sign-in-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function LoginPage() {
  // Redirect if already authenticated
  await requireNoAuth();

  return (
    <div className="py-16">
      <Container size="sm">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Willkommen zurück</CardTitle>
              <CardDescription>
                Melden Sie sich an, um fortzufahren
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Laden...</div>}>
                <SignInForm />
              </Suspense>
              
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}