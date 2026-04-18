require('dotenv').config();
const fs = require('fs');
const pool = require('./config/database');

async function runMigrations() {
  console.log('🔄 Running database migrations...\n');
  
  try {
    // Read the migration file
    const migrationSQL = fs.readFileSync('./server/migrations/001_initial_schema.sql', 'utf-8');
    
    // Execute the migration
    await pool.query(migrationSQL);
    
    console.log('✅ Migrations completed successfully!\n');
    
    // Verify tables were created
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📊 Tables created:');
    result.rows.forEach(row => {
      console.log(`   • ${row.table_name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigrations();
