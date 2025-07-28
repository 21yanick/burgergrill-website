'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signInAction, type AuthState } from '@/lib/auth/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SubmitButton } from '@/components/auth/submit-button';
import { AlertCircle } from 'lucide-react';

const initialState: AuthState = {
  error: undefined,
  success: undefined,
  field_errors: undefined,
};

export function SignInForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      
      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      
      {state.success && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          aria-describedby={state.field_errors?.email ? "email-error" : undefined}
        />
        {state.field_errors?.email && (
          <p id="email-error" className="text-sm text-destructive">
            {state.field_errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
          aria-describedby={state.field_errors?.password ? "password-error" : undefined}
        />
        {state.field_errors?.password && (
          <p id="password-error" className="text-sm text-destructive">
            {state.field_errors.password[0]}
          </p>
        )}
      </div>

      <SubmitButton>Sign In</SubmitButton>
    </form>
  );
}