// One-time database setup script
// Run this once to create all tables in the Railway PostgreSQL database

require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Read migration file
    const migrationSQL = fs.readFileSync('./server/migrations/001_initial_schema.sql', 'utf-8');
    
    console.log('📝 Running migrations...\n');
    await client.query(migrationSQL);
    console.log('✅ Migrations completed!\n');

    // Verify tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📊 Tables created:');
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });
    console.log('');

    // Create a test organization and user
    console.log('👤 Creating test organization and user...\n');
    
    const orgResult = await client.query(`
      INSERT INTO organizations (id, name, subdomain, plan, status)
      VALUES ('00000000-0000-0000-0000-000000000001', 'Test Organization', 'test', 'enterprise', 'active')
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `);
    
    if (orgResult.rows.length > 0) {
      console.log('✅ Test organization created');
    } else {
      console.log('ℹ️  Test organization already exists');
    }

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('Test123', 10);
    
    const userResult = await client.query(`
      INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name, role, status)
      VALUES (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        'test@test.com',
        $1,
        'Test',
        'User',
        'admin',
        'active'
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `, [hashedPassword]);
    
    if (userResult.rows.length > 0) {
      console.log('✅ Test user created (test@test.com / Test123)');
    } else {
      console.log('ℹ️  Test user already exists');
    }

    console.log('\n🎉 Database setup complete!\n');
    console.log('You can now:');
    console.log('  • Import CSV files');
    console.log('  • View contacts at /contacts');
    console.log('  • View companies at /companies');
    console.log('  • Login with test@test.com / Test123\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
