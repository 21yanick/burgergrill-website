'use client';

import { useActionState } from 'react';
import { signUpAction, type AuthState } from '@/lib/auth/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SubmitButton } from '@/components/auth/submit-button';
import { AlertCircle, CheckCircle } from 'lucide-react';

const initialState: AuthState = {
  error: undefined,
  success: undefined,
  field_errors: undefined,
};

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      
      {state.success && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700 dark:text-green-200">
            {state.success}
          </AlertDescription>
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required
          aria-describedby={state.field_errors?.confirmPassword ? "confirmPassword-error" : undefined}
        />
        {state.field_errors?.confirmPassword && (
          <p id="confirmPassword-error" className="text-sm text-destructive">
            {state.field_errors.confirmPassword[0]}
          </p>
        )}
      </div>

      <SubmitButton>Create Account</SubmitButton>
    </form>
  );
}