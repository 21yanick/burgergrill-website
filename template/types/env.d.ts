declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_SENTRY_DSN?: string;
    NEXT_PUBLIC_APP_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    RESEND_API_KEY: string;
    SENTRY_AUTH_TOKEN?: string;
    DATABASE_URL?: string;
    LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
    NODE_ENV: 'development' | 'production' | 'test';
  }
}