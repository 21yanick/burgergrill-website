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
                  Ungültiger Bestätigungslink
                </CardTitle>
                <CardDescription>
                  Dieser Bestätigungslink ist ungültig oder abgelaufen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Der Bestätigungslink, den Sie angeklickt haben, ist ungültig oder abgelaufen.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center">
                  <Button asChild>
                    <Link href="/auth/login">
                      Zur Anmeldung
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
                  Bestätigung fehlgeschlagen
                </CardTitle>
                <CardDescription>
                  Wir konnten Ihre E-Mail-Adresse nicht bestätigen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error.message || 'Ein Fehler ist bei der Bestätigung aufgetreten'}
                  </AlertDescription>
                </Alert>
                
                <div className="text-center">
                  <Button asChild>
                    <Link href="/auth/login">
                      Zur Anmeldung
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