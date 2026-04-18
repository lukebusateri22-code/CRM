const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  const organization_id = '00000000-0000-0000-0000-000000000001';
  
  try {
    const result = await pool.query(
      `SELECT * FROM companies 
       WHERE organization_id = $1
       ORDER BY created_at DESC`,
      [organization_id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get single company
router.get('/:id', async (req, res) => {
  const organization_id = '00000000-0000-0000-0000-000000000001';
  
  try {
    const result = await pool.query(
      'SELECT * FROM companies WHERE id = $1 AND organization_id = $2',
      [req.params.id, organization_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Create company
router.post('/', async (req, res) => {
  const organization_id = '00000000-0000-0000-0000-000000000001';
  const user_id = '00000000-0000-0000-0000-000000000001';
  
  const { name, industry, website, phone, address, city, state, country, employees, revenue } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO companies (
        organization_id, name, industry, website, phone, address,
        city, state, country, employees, revenue, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [organization_id, name, industry, website, phone, address, city, state, country, employees, revenue, user_id]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Update company
router.put('/:id', async (req, res) => {
  const organization_id = '00000000-0000-0000-0000-000000000001';
  const { name, industry, website, phone, address, city, state, country, employees, revenue } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE companies 
       SET name = $1, industry = $2, website = $3, phone = $4, address = $5,
           city = $6, state = $7, country = $8, employees = $9, revenue = $10,
           updated_at = NOW()
       WHERE id = $11 AND organization_id = $12
       RETURNING *`,
      [name, industry, website, phone, address, city, state, country, employees, revenue, req.params.id, organization_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// Delete company
router.delete('/:id', async (req, res) => {
  const organization_id = '00000000-0000-0000-0000-000000000001';
  
  try {
    const result = await pool.query(
      'DELETE FROM companies WHERE id = $1 AND organization_id = $2 RETURNING id',
      [req.params.id, organization_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

module.exports = router;
