require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Create test user via Supabase API
async function createTestUser() {
  console.log('🔧 Environment check...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('🚀 Creating test user...');

  try {
    // Create user with Supabase Auth
    const { data: { user }, error } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Test User'
      }
    });

    if (error) {
      console.error('❌ Error creating user:', error);
      return;
    }

    console.log('✅ Test user created!');
    console.log('📧 Email: test@example.com');
    console.log('🔐 Password: password123');
    console.log('👤 User ID:', user.id);

    // Ensure profile exists
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: 'Test User'
      });

    if (profileError) {
      console.error('❌ Error creating profile:', profileError);
    } else {
      console.log('✅ Profile created!');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createTestUser();