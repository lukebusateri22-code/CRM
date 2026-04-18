// Script to create admin account
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createAdminAccount() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create organization
    const orgResult = await client.query(
      `INSERT INTO organizations (name, subdomain, plan, max_users, max_contacts)
       VALUES ($1, $2, 'enterprise', 100, 100000)
       RETURNING id`,
      ['GrowthPartner Admin', 'growthpartner-admin']
    );
    const organizationId = orgResult.rows[0].id;

    // Hash password
    const passwordHash = await bcrypt.hash('Test123', 10);

    // Create admin user
    const userResult = await client.query(
      `INSERT INTO users (organization_id, email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5, 'admin')
       RETURNING id, email, first_name, last_name, role`,
      [organizationId, 'lukebusateri22@gmail.com', passwordHash, 'Luke', 'Busateri']
    );

    await client.query('COMMIT');

    console.log('✅ Admin account created successfully!');
    console.log('Email: lukebusateri22@gmail.com');
    console.log('Password: Test123');
    console.log('Organization:', orgResult.rows[0]);
    console.log('User:', userResult.rows[0]);
    
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating admin account:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

createAdminAccount();
