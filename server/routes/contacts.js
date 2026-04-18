const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all contacts for organization
router.get('/', async (req, res) => {
  // Temporarily bypass auth for testing
  const organization_id = '00000000-0000-0000-0000-000000000001';
  
  try {
    const result = await pool.query(
      `SELECT c.*, comp.name as company_name 
       FROM contacts c
       LEFT JOIN companies comp ON c.company_id = comp.id
       WHERE c.organization_id = $1
       ORDER BY c.created_at DESC`,
      [organization_id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Get single contact
router.get('/:id', async (req, res) => {
  const organization_id = '00000000-0000-0000-0000-000000000001';
  
  try {
    const result = await pool.query(
      `SELECT c.*, comp.name as company_name 
       FROM contacts c
       LEFT JOIN companies comp ON c.company_id = comp.id
       WHERE c.id = $1 AND c.organization_id = $2`,
      [req.params.id, organization_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// Create contact
router.post('/', async (req, res) => {
  const organization_id = '00000000-0000-0000-0000-000000000001';
  const user_id = '00000000-0000-0000-0000-000000000001';
  
  const { first_name, last_name, email, phone, title, company_id, linkedin } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO contacts (
        organization_id, first_name, last_name, email, phone, 
        title, company_id, linkedin, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [organization_id, first_name, last_name, email, phone, title, company_id, linkedin, user_id]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Update contact
router.put('/:id', async (req, res) => {
  const organization_id = '00000000-0000-0000-0000-000000000001';
  const { first_name, last_name, email, phone, title, company_id, linkedin } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE contacts 
       SET first_name = $1, last_name = $2, email = $3, phone = $4,
           title = $5, company_id = $6, linkedin = $7, updated_at = NOW()
       WHERE id = $8 AND organization_id = $9
       RETURNING *`,
      [first_name, last_name, email, phone, title, company_id, linkedin, req.params.id, organization_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Delete contact
router.delete('/:id', async (req, res) => {
  const organization_id = '00000000-0000-0000-0000-000000000001';
  
  try {
    const result = await pool.query(
      'DELETE FROM contacts WHERE id = $1 AND organization_id = $2 RETURNING id',
      [req.params.id, organization_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

module.exports = router;
