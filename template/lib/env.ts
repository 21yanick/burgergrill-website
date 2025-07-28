import { z } from 'zod';

const envSchema = z.object({
  // Public variables (exposed to client)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  
  // Server-only variables
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  
  // Database Direct Connection (for migrations)
  DATABASE_URL: z.string().optional(),
  
  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  
  // Runtime
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Validate on startup
export const env = envSchema.parse(process.env);