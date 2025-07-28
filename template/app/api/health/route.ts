import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    services: {
      app: 'healthy',
      supabase: 'unknown',
    },
  };

  // Simple Supabase API connectivity check
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const response = await fetch(`${supabaseUrl}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5s timeout
      });
      checks.services.supabase = response.ok ? 'healthy' : 'unhealthy';
    } else {
      checks.services.supabase = 'not_configured';
    }
  } catch {
    checks.services.supabase = 'unhealthy';
  }

  const isHealthy = checks.services.app === 'healthy';
  
  return NextResponse.json(checks, { 
    status: isHealthy ? 200 : 503 
  });
}