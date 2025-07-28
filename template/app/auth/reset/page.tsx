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
              <CardTitle className="text-2xl">Reset your password</CardTitle>
              <CardDescription>
                Enter your email address and we&apos;ll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
              </Suspense>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Remember your password?{' '}
                  <Link 
                    href="/auth/login" 
                    className="text-primary hover:underline"
                  >
                    Sign in
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