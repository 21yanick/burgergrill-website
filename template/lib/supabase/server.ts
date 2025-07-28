import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/types/database';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

export async function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  console.log('DEBUG: Service client config:');
  console.log('- URL:', url);
  console.log('- Key (first 20 chars):', key.substring(0, 20) + '...');
  console.log('- Key length:', key.length);
  
  const { createClient } = await import('@supabase/supabase-js');
  const client = createClient<Database>(url, key);
  
  console.log('DEBUG: Client created:', !!client);
  return client;
}

// IMPORTANT: Always use getUser() in server code, not getSession()
// getUser() validates the auth token with Supabase's servers every time
export async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    // Only log actual errors, not "no session" errors
    if (error.message !== 'Auth session missing!') {
      console.error('Error fetching user:', error);
    }
    return null;
  }
  
  return user;
}

// Get user session data (safe for server-side use)
export async function getSession() {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error fetching session:', error);
    return null;
  }
  
  return session;
}

// Helper function to require authentication
export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect('/auth/login');
  }
  return user;
}

// Helper function to require no authentication (redirect if logged in)
export async function requireNoAuth() {
  const user = await getUser();
  if (user) {
    redirect('/dashboard');
  }
}

// Helper function to get user profile
export async function getUserProfile() {
  const user = await getUser();
  
  if (!user) {
    return null;
  }
  
  console.log('DEBUG: Fetching profile for user:', user.id);
  
  // Use service role client for database operations to bypass RLS
  const serviceSupabase = await createServiceClient();
  console.log('DEBUG: Service client created');
  
  // Test if service client works at all
  const { data: testData, error: testError } = await serviceSupabase
    .from('profiles')
    .select('count')
    .limit(1);
  console.log('DEBUG: Test query - data:', testData, 'error:', testError);
  
  // Also test with regular client to compare
  const regularClient = await createClient();
  const { data: regularTest, error: regularError } = await regularClient
    .from('profiles')
    .select('count')
    .limit(1);
  console.log('DEBUG: Regular client test - data:', regularTest, 'error:', regularError);
  
  // Test with direct HTTP fetch to bypass Supabase client
  try {
    const directResponse = await fetch('http://localhost:55321/rest/v1/profiles?select=*&limit=3', {
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Content-Type': 'application/json'
      }
    });
    console.log('DEBUG: Direct fetch status:', directResponse.status);
    const directText = await directResponse.text();
    console.log('DEBUG: Direct fetch response:', directText);
  } catch (directError) {
    console.log('DEBUG: Direct fetch error:', directError);
  }
  
  const { data: profile, error } = await serviceSupabase
    .from('profiles')
    .select('*')
    .eq('id', user.id);
    
  console.log('DEBUG: Profile query result - data:', profile, 'error:', error);
  
  // Also try a direct query without eq filter
  const { data: allProfiles, error: allError } = await serviceSupabase
    .from('profiles')
    .select('*')
    .limit(5);
    
  console.log('DEBUG: All profiles - data:', allProfiles, 'error:', allError);
    
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return profile?.[0] || null;
}