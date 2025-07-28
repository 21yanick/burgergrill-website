const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

console.log('🔄 Running database migrations...');

// Database connection string
const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  console.log('Please check your .env.local file');
  process.exit(1);
}

// Check if migrations directory exists
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
if (!fs.existsSync(migrationsDir)) {
  console.error('❌ Migrations directory not found:', migrationsDir);
  process.exit(1);
}

// Get all SQL migration files
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort();

if (migrationFiles.length === 0) {
  console.log('ℹ️  No migration files found');
  process.exit(0);
}

console.log(`📁 Found ${migrationFiles.length} migration file(s)`);

// Function to execute a single migration
function executeMigration(filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(migrationsDir, filename);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log(`⚡ Executing: ${filename}`);
    
    // Use psql to execute the migration
    const command = `psql "${DB_URL}" -c "${sql.replace(/"/g, '\\"')}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Failed to execute ${filename}:`, error.message);
        reject(error);
        return;
      }
      
      if (stderr && !stderr.includes('NOTICE')) {
        console.warn(`⚠️  Warning in ${filename}:`, stderr);
      }
      
      console.log(`✅ Completed: ${filename}`);
      resolve();
    });
  });
}

// Execute migrations sequentially
async function runMigrations() {
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

    // Execute each migration
    for (const filename of migrationFiles) {
      await executeMigration(filename);
    }
    
    console.log('');
    console.log('🎉 All migrations completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('- Run: npm run db:seed (to add test data)');
    console.log('- Visit: http://localhost:55323 (Supabase Studio)');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
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
  
  runMigrations();
});