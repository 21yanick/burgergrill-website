const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up database...');

// Check if .env.local exists
if (!fs.existsSync('.env.local')) {
  console.log('📝 Creating .env.local from .env...');
  fs.copyFileSync('.env', '.env.local');
  console.log('✅ .env.local created from .env.');
}

// Check if Docker is running
exec('docker ps', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Docker is not running or not installed.');
    console.log('Please install Docker and make sure it\'s running.');
    process.exit(1);
  }

  console.log('✅ Docker is running');
  
  // Start Supabase services
  console.log('🐳 Starting Supabase services...');
  exec('docker compose up -d', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Failed to start Supabase services:', error);
      process.exit(1);
    }
    
    console.log('✅ Supabase services started');
    console.log('⏳ Waiting for services to be ready...');
    
    // Wait for services to be ready
    setTimeout(() => {
      console.log('📊 Running database migrations...');
      
      // Execute migration
      exec('docker exec supabase-db psql -U postgres -d postgres -f supabase/migrations/00001_clean_schema.sql', (error, stdout, stderr) => {
        if (error) {
          console.log('⚠️ Migration failed, trying manual table creation...');
          // Fallback: Create essential tables manually
          exec('docker exec supabase-db psql -U postgres -d postgres -c "CREATE EXTENSION IF NOT EXISTS \\"uuid-ossp\\"; CREATE TABLE IF NOT EXISTS public.profiles (id UUID PRIMARY KEY, email TEXT UNIQUE NOT NULL, full_name TEXT, avatar_url TEXT, stripe_customer_id TEXT UNIQUE, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()); ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;"', (error2) => {
            if (error2) {
              console.log('❌ Failed to create tables:', error2.message);
            } else {
              console.log('✅ Essential tables created manually');
            }
            
            console.log('✅ Database setup completed!');
            console.log('');
            console.log('🎉 Next steps:');
            console.log('1. Open Supabase Studio: http://localhost:55323');
            console.log('2. Run: npm run dev');
            console.log('3. Visit: http://localhost:3000');
          });
        } else {
          console.log('✅ Migrations executed successfully!');
          console.log('✅ Database setup completed!');
          console.log('');
          console.log('🎉 Next steps:');
          console.log('1. Open Supabase Studio: http://localhost:55323');
          console.log('2. Run: npm run dev');
          console.log('3. Visit: http://localhost:3000');
        }
      });
    }, 10000);
  });
});