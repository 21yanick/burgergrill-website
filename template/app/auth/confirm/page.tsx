import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

interface ConfirmPageProps {
  searchParams: Promise<{
    token_hash?: string;
    type?: string;
    next?: string;
  }>;
}

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const { token_hash, type, next } = await searchParams;

  // If no token, show error
  if (!token_hash || !type) {
    return (
      <div className="py-16">
        <Container size="sm">
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-destructive">
                  Invalid confirmation link
                </CardTitle>
                <CardDescription>
                  This confirmation link is invalid or has expired
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    The confirmation link you clicked is invalid or has expired.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center">
                  <Button asChild>
                    <Link href="/auth/login">
                      Go to Sign In
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  // Verify the token
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: type as 'email' | 'signup' | 'recovery' | 'email_change',
  });

  if (error) {
    return (
      <div className="py-16">
        <Container size="sm">
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-destructive">
                  Confirmation failed
                </CardTitle>
                <CardDescription>
                  We couldn&apos;t confirm your email address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error.message || 'An error occurred during confirmation'}
                  </AlertDescription>
                </Alert>
                
                <div className="text-center">
                  <Button asChild>
                    <Link href="/auth/login">
                      Go to Sign In
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  // Success - redirect to dashboard or specified next URL
  redirect(next || '/dashboard');
}