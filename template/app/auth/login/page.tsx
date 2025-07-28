import { Suspense } from 'react';
import { requireNoAuth } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { SignInForm } from '@/components/auth/sign-in-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function LoginPage() {
  // Redirect if already authenticated
  await requireNoAuth();

  return (
    <div className="py-16">
      <Container size="sm">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <SignInForm />
              </Suspense>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link 
                    href="/auth/register" 
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
                <p className="mt-2 text-muted-foreground">
                  <Link 
                    href="/auth/reset" 
                    className="text-primary hover:underline"
                  >
                    Forgot your password?
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