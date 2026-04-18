const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const { authenticateToken } = require('../middleware/auth');
const pool = require('../config/database');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// AI-powered column mapping
function intelligentColumnMapping(headers) {
  const mapping = {};
  
  const patterns = {
    first_name: ['first name', 'firstname', 'fname', 'given name', 'forename'],
    last_name: ['last name', 'lastname', 'lname', 'surname', 'family name'],
    email: ['email', 'e-mail', 'email address', 'mail'],
    phone: ['phone', 'telephone', 'tel', 'mobile', 'cell', 'phone number'],
    title: ['title', 'job title', 'position', 'role'],
    company_name: ['company', 'company name', 'organization', 'organisation', 'business'],
    linkedin: ['linkedin', 'linkedin url', 'linkedin profile'],
    
    // Company fields
    name: ['name', 'company name', 'business name'],
    industry: ['industry', 'sector', 'vertical'],
    website: ['website', 'url', 'web', 'site'],
    address: ['address', 'street', 'street address'],
    city: ['city', 'town'],
    state: ['state', 'province', 'region'],
    country: ['country', 'nation'],
    employees: ['employees', 'employee count', 'staff', 'headcount'],
    revenue: ['revenue', 'annual revenue', 'sales'],
    
    // Deal fields
    value: ['value', 'amount', 'deal value', 'price'],
    stage: ['stage', 'status', 'deal stage', 'pipeline stage'],
    probability: ['probability', 'win probability', 'chance'],
    expected_close_date: ['close date', 'expected close', 'closing date'],
    description: ['description', 'notes', 'details', 'comments']
  };
  
  headers.forEach(header => {
    const normalized = header.toLowerCase().trim();
    
    for (const [field, patterns_list] of Object.entries(patterns)) {
      if (patterns_list.some(pattern => normalized.includes(pattern))) {
        mapping[header] = field;
        break;
      }
    }
    
    // If no match found, keep original header as suggestion
    if (!mapping[header]) {
      mapping[header] = normalized.replace(/[^a-z0-9]/g, '_');
    }
  });
  
  return mapping;
}

// Parse CSV and return preview with suggested mapping
router.post('/preview', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const csvContent = req.file.buffer.toString('utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    if (records.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty' });
    }

    const headers = Object.keys(records[0]);
    const suggestedMapping = intelligentColumnMapping(headers);
    
    res.json({
      headers,
      suggestedMapping,
      preview: records.slice(0, 5), // First 5 rows
      totalRows: records.length
    });
  } catch (error) {
    console.error('CSV preview error:', error);
    res.status(500).json({ error: 'Failed to parse CSV file' });
  }
});

// Import contacts from CSV
router.post('/contacts', authenticateToken, upload.single('file'), async (req, res) => {
  const { organization_id, id: user_id } = req.user;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const mapping = JSON.parse(req.body.mapping || '{}');
    const csvContent = req.file.buffer.toString('utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    let successful = 0;
    let failed = 0;
    const errors = [];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (let i = 0; i < records.length; i++) {
        const row = records[i];
        try {
          // Map CSV columns to database fields
          const contact = {};
          for (const [csvColumn, dbField] of Object.entries(mapping)) {
            if (row[csvColumn]) {
              contact[dbField] = row[csvColumn];
            }
          }

          // Validate required fields
          if (!contact.first_name || !contact.last_name) {
            throw new Error('Missing required fields: first_name or last_name');
          }

          // Handle company - create if doesn't exist
          let company_id = null;
          if (contact.company_name) {
            const companyResult = await client.query(
              `INSERT INTO companies (organization_id, name, created_by)
               VALUES ($1, $2, $3)
               ON CONFLICT DO NOTHING
               RETURNING id`,
              [organization_id, contact.company_name, user_id]
            );
            
            if (companyResult.rows.length > 0) {
              company_id = companyResult.rows[0].id;
            } else {
              // Company already exists, find it
              const existing = await client.query(
                'SELECT id FROM companies WHERE organization_id = $1 AND name = $2',
                [organization_id, contact.company_name]
              );
              if (existing.rows.length > 0) {
                company_id = existing.rows[0].id;
              }
            }
          }

          // Insert contact
          await client.query(
            `INSERT INTO contacts (
              organization_id, first_name, last_name, email, phone, 
              title, company_id, linkedin, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              organization_id,
              contact.first_name,
              contact.last_name,
              contact.email || null,
              contact.phone || null,
              contact.title || null,
              company_id,
              contact.linkedin || null,
              user_id
            ]
          );

          successful++;
        } catch (error) {
          failed++;
          errors.push({ row: i + 1, error: error.message });
        }
      }

      // Log import history
      await client.query(
        `INSERT INTO import_history (
          organization_id, user_id, filename, record_type, 
          total_records, successful_records, failed_records, status
        ) VALUES ($1, $2, $3, 'contacts', $4, $5, $6, 'completed')`,
        [organization_id, user_id, req.file.originalname, records.length, successful, failed]
      );

      await client.query('COMMIT');

      res.json({
        success: true,
        totalRows: records.length,
        successful,
        failed,
        errors: errors.slice(0, 10) // Return first 10 errors
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('CSV import error:', error);
    res.status(500).json({ error: 'Failed to import contacts' });
  }
});

// Import companies from CSV
router.post('/companies', authenticateToken, upload.single('file'), async (req, res) => {
  const { organization_id, id: user_id } = req.user;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const mapping = JSON.parse(req.body.mapping || '{}');
    const csvContent = req.file.buffer.toString('utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    let successful = 0;
    let failed = 0;
    const errors = [];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (let i = 0; i < records.length; i++) {
        const row = records[i];
        try {
          const company = {};
          for (const [csvColumn, dbField] of Object.entries(mapping)) {
            if (row[csvColumn]) {
              company[dbField] = row[csvColumn];
            }
          }

          if (!company.name) {
            throw new Error('Missing required field: name');
          }

          await client.query(
            `INSERT INTO companies (
              organization_id, name, industry, website, phone, email,
              address, city, state, country, employees, revenue, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            [
              organization_id,
              company.name,
              company.industry || null,
              company.website || null,
              company.phone || null,
              company.email || null,
              company.address || null,
              company.city || null,
              company.state || null,
              company.country || null,
              company.employees ? parseInt(company.employees) : null,
              company.revenue ? parseFloat(company.revenue) : null,
              user_id
            ]
          );

          successful++;
        } catch (error) {
          failed++;
          errors.push({ row: i + 1, error: error.message });
        }
      }

      await client.query(
        `INSERT INTO import_history (
          organization_id, user_id, filename, record_type,
          total_records, successful_records, failed_records, status
        ) VALUES ($1, $2, $3, 'companies', $4, $5, $6, 'completed')`,
        [organization_id, user_id, req.file.originalname, records.length, successful, failed]
      );

      await client.query('COMMIT');

      res.json({
        success: true,
        totalRows: records.length,
        successful,
        failed,
        errors: errors.slice(0, 10)
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('CSV import error:', error);
    res.status(500).json({ error: 'Failed to import companies' });
  }
});

// Get import history
router.get('/history', authenticateToken, async (req, res) => {
  const { organization_id } = req.user;
  
  try {
    const result = await pool.query(
      `SELECT ih.*, u.first_name, u.last_name
       FROM import_history ih
       LEFT JOIN users u ON ih.user_id = u.id
       WHERE ih.organization_id = $1
       ORDER BY ih.created_at DESC
       LIMIT 50`,
      [organization_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Import history error:', error);
    res.status(500).json({ error: 'Failed to fetch import history' });
  }
});

module.exports = router;
