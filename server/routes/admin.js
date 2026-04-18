const express = require('express');
const bcrypt = require('bcrypt');
const { authenticateToken, requireRole } = require('../middleware/auth');
const pool = require('../config/database');

const router = express.Router();

// All admin routes require admin role
router.use(authenticateToken);
router.use(requireRole('admin', 'super_admin'));

// Get all organizations
router.get('/organizations', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.*,
        COUNT(DISTINCT u.id) as user_count,
        COUNT(DISTINCT c.id) as contact_count,
        COUNT(DISTINCT co.id) as company_count,
        COUNT(DISTINCT d.id) as deal_count
      FROM organizations o
      LEFT JOIN users u ON o.id = u.organization_id
      LEFT JOIN contacts c ON o.id = c.organization_id
      LEFT JOIN companies co ON o.id = co.organization_id
      LEFT JOIN deals d ON o.id = d.organization_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

// Get all users across organizations
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.role, u.is_active,
        u.last_login, u.created_at,
        o.name as organization_name, o.plan
      FROM users u
      JOIN organizations o ON u.organization_id = o.id
      ORDER BY u.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create new organization with admin user
router.post('/organizations', async (req, res) => {
  const { organizationName, email, password, firstName, lastName, plan } = req.body;

  try {
    if (!organizationName || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const subdomain = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);

    const passwordHash = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const orgResult = await client.query(
        `INSERT INTO organizations (name, subdomain, plan, max_users, max_contacts)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [organizationName, subdomain, plan || 'professional', 10, 10000]
      );
      const organization = orgResult.rows[0];

      const userResult = await client.query(
        `INSERT INTO users (organization_id, email, password_hash, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, $5, 'admin')
         RETURNING id, email, first_name, last_name, role, organization_id`,
        [organization.id, email, passwordHash, firstName, lastName]
      );

      await client.query('COMMIT');

      res.status(201).json({
        organization,
        user: userResult.rows[0]
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({ error: error.message || 'Failed to create organization' });
  }
});

// Reset user password
router.post('/users/:userId/reset-password', async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;

  try {
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [passwordHash, userId]
    );

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Toggle user active status
router.patch('/users/:userId/toggle-active', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'UPDATE users SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING is_active',
      [userId]
    );

    res.json({ success: true, is_active: result.rows[0].is_active });
  } catch (error) {
    console.error('Toggle user error:', error);
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
});

// Get usage statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM organizations) as total_organizations,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM contacts) as total_contacts,
        (SELECT COUNT(*) FROM companies) as total_companies,
        (SELECT COUNT(*) FROM deals) as total_deals,
        (SELECT COUNT(*) FROM users WHERE last_login > NOW() - INTERVAL '7 days') as active_users_7d,
        (SELECT COUNT(*) FROM users WHERE last_login > NOW() - INTERVAL '30 days') as active_users_30d
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Delete organization (and all associated data)
router.delete('/organizations/:orgId', async (req, res) => {
  const { orgId } = req.params;

  try {
    await pool.query('DELETE FROM organizations WHERE id = $1', [orgId]);
    res.json({ success: true, message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Delete organization error:', error);
    res.status(500).json({ error: 'Failed to delete organization' });
  }
});

module.exports = router;
