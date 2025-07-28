const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

console.log('🌱 Seeding database with development data...');

// Database connection string
const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  console.log('Please check your .env.local file');
  process.exit(1);
}

// Safety check for environment
if (process.env.NODE_ENV === 'production') {
  console.error('❌ Cannot run seed in production environment');
  console.log('This command is only for development');
  process.exit(1);
}

// Check if seed file exists
const seedFile = path.join(__dirname, '..', 'supabase', 'seed.sql');
if (!fs.existsSync(seedFile)) {
  console.error('❌ Seed file not found:', seedFile);
  process.exit(1);
}

console.log('📁 Loading seed data from supabase/seed.sql');

// Function to execute seed file
function executeSeed() {
  return new Promise((resolve, reject) => {
    const sql = fs.readFileSync(seedFile, 'utf8');
    
    console.log('⚡ Executing seed data...');
    
    // Use psql to execute the seed
    const command = `psql "${DB_URL}" -c "${sql.replace(/"/g, '\\"')}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Failed to execute seed:', error.message);
        reject(error);
        return;
      }
      
      if (stderr && !stderr.includes('NOTICE')) {
        console.warn('⚠️  Warning during seeding:', stderr);
      }
      
      console.log('✅ Seed data executed successfully');
      resolve();
    });
  });
}

// Main seeding function
async function runSeed() {
  try {
    // Check database connection first
    await new Promise((resolve, reject) => {
      exec(`psql "${DB_URL}" -c "SELECT 1;"`, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Cannot connect to database:', error.message);
          console.log('Please make sure your database is running and DATABASE_URL is correct');
          reject(error);
          return;
        }
        console.log('✅ Database connection successful');
        resolve();
      });
    });

    // Check if tables exist
    await new Promise((resolve, reject) => {
      const checkQuery = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'subscriptions');";
      exec(`psql "${DB_URL}" -c "${checkQuery}"`, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Failed to check tables:', error.message);
          reject(error);
          return;
        }
        
        const tableCount = (stdout.match(/profiles|subscriptions/g) || []).length;
        if (tableCount < 2) {
          console.error('❌ Required tables not found. Please run migrations first:');
          console.log('npm run db:migrate');
          reject(new Error('Missing tables'));
          return;
        }
        
        console.log('✅ Required tables found');
        resolve();
      });
    });

    // Execute seed
    await executeSeed();
    
    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('Development data created:');
    console.log('👤 Test User: test@example.com (password: password123)');
    console.log('💳 Test Subscription: Active starter plan');
    console.log('');
    console.log('Next steps:');
    console.log('- Run: npm run dev');
    console.log('- Login with: test@example.com / password123');
    console.log('- Visit Studio: http://localhost:55323');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Check for psql availability
exec('which psql', (error) => {
  if (error) {
    console.error('❌ psql command not found');
    console.log('Please install PostgreSQL client tools');
    console.log('- macOS: brew install postgresql');
    console.log('- Ubuntu: sudo apt-get install postgresql-client');
    console.log('- Or use Docker: docker exec nextjs-starter-db psql ...');
    process.exit(1);
  }
  
  runSeed();
});