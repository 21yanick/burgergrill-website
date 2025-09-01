'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getLogger } from '@/lib/logger';
import { z } from 'zod';

const logger = getLogger('auth');

// Validation schemas
const signInSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen haben'),
});

const signUpSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen haben'),
  confirmPassword: z.string().min(6, 'Passwort muss mindestens 6 Zeichen haben'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

const resetPasswordSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
});

const updatePasswordSchema = z.object({
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen haben'),
  confirmPassword: z.string().min(6, 'Passwort muss mindestens 6 Zeichen haben'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

// Auth action state types
export type AuthState = {
  error?: string;
  success?: string;
  field_errors?: Record<string, string[]>;
};

// Sign in action
export async function signInAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  
  try {
    // Validate form data
    const validatedFields = signInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return {
        error: 'Ungültige Formulardaten',
        field_errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedFields.data;

    // Sign in with Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logger.error(`Sign in failed: ${error.message} for ${email}`);
      return {
        error: 'Ungültige E-Mail oder Passwort',
      };
    }

    logger.info({ email }, 'User signed in successfully');
    
  } catch (error) {
    logger.error({ error }, 'Sign in error');
    return {
      error: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    };
  }

  // Redirect will be handled by middleware
  redirect('/dashboard/opening-hours');
}

// Sign up action
export async function signUpAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  
  try {
    // Validate form data
    const validatedFields = signUpSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
      return {
        error: 'Ungültige Formulardaten',
        field_errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedFields.data;

    // Sign up with Supabase
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
      },
    });

    if (error) {
      logger.error({ error: error.message, email }, 'Sign up failed');
      return {
        error: error.message,
      };
    }

    logger.info({ email }, 'User signed up successfully');

    return {
      success: 'Überprüfen Sie Ihre E-Mails für einen Bestätigungslink',
    };
  } catch (error) {
    logger.error({ error }, 'Sign up error');
    return {
      error: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    };
  }
}

// Reset password action
export async function resetPasswordAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  
  try {
    // Validate form data
    const validatedFields = resetPasswordSchema.safeParse({
      email: formData.get('email'),
    });

    if (!validatedFields.success) {
      return {
        error: 'Ungültige Formulardaten',
        field_errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email } = validatedFields.data;

    // Send reset password email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      logger.error({ error: error.message, email }, 'Reset password failed');
      return {
        error: error.message,
      };
    }

    logger.info({ email }, 'Password reset email sent');

    return {
      success: 'Überprüfen Sie Ihre E-Mails für einen Passwort-Reset-Link',
    };
  } catch (error) {
    logger.error({ error }, 'Reset password error');
    return {
      error: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    };
  }
}

// Update password action
export async function updatePasswordAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  
  try {
    // Validate form data
    const validatedFields = updatePasswordSchema.safeParse({
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
      return {
        error: 'Ungültige Formulardaten',
        field_errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { password } = validatedFields.data;

    // Update password
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      logger.error({ error: error.message }, 'Update password failed');
      return {
        error: error.message,
      };
    }

    logger.info('Passwort erfolgreich aktualisiert');

    return {
      success: 'Passwort erfolgreich aktualisiert',
    };
  } catch (error) {
    logger.error({ error }, 'Update password error');
    return {
      error: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    };
  }
}

// Sign out action
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      logger.error({ error: error.message }, 'Sign out failed');
      throw error;
    }

    logger.info('User signed out successfully');
  } catch (error) {
    logger.error({ error }, 'Sign out error');
    throw error;
  }
  
  redirect('/');
}