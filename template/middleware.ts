import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // COMING SOON MODE CHECK - Highest Priority
  const showComingSoon = process.env.SHOW_COMING_SOON === 'true';
  
  // Debug-Logging für Production-Debugging
  console.log('🚀 MIDDLEWARE - Coming Soon Check:', {
    showComingSoon,
    path: request.nextUrl.pathname,
    timestamp: new Date().toISOString(),
    SHOW_COMING_SOON: process.env.SHOW_COMING_SOON
  });

  // Coming Soon Mode aktiviert - alle Requests auf Coming Soon umleiten
  if (showComingSoon) {
    // Nur normale Seiten umleiten, nicht API Routes oder Assets
    if (request.nextUrl.pathname.startsWith('/api') || 
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/auth') ||
        request.nextUrl.pathname.includes('.') ||
        request.nextUrl.pathname === '/coming-soon-internal') {
      // Für Coming Soon Internal Route: normale Middleware weiter
      if (request.nextUrl.pathname === '/coming-soon-internal') {
        // Skip auth für Coming Soon Page
        return NextResponse.next();
      }
      // Andere Assets/API normal weiter
      if (!request.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.next();
      }
    }

    // Internal Rewrite zur Coming Soon Page
    const url = request.nextUrl.clone();
    url.pathname = '/coming-soon-internal';
    
    console.log('✅ MIDDLEWARE - Redirecting to Coming Soon');
    return NextResponse.rewrite(url);
  }

  console.log('❌ MIDDLEWARE - Normal website mode');
  
  // IMPORTANT: Handle auth next, then apply security headers
  const { supabaseResponse, user } = await updateSession(request);
  
  // Protected routes - require authentication
  const protectedRoutes = ['/dashboard', '/settings', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Auth routes - redirect if already logged in
  const authRoutes = ['/auth/login', '/auth/register', '/auth/reset'];
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Route protection logic
  if (isProtectedRoute && !user) {
    // User is not authenticated, redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  if (isAuthRoute && user) {
    // User is already authenticated, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Apply security headers to the response
  const response = supabaseResponse;
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Get Supabase URL from environment (validated in lib/env.ts)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  // CSP Header - only add connect-src if supabaseUrl is available
  const connectSrc = supabaseUrl 
    ? `'self' ${supabaseUrl}`
    : `'self'`;
  
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    connect-src ${connectSrc};
    font-src 'self';
    frame-src 'self' https://maps.google.com https://www.google.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};