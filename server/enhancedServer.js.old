const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const { seedDatabase } = require('./mockData');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*'
    : '*',
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Only seed database in development
if (process.env.NODE_ENV !== 'production') {
  seedDatabase();
}

app.get('/api/dashboard/stats', (req, res) => {
  try {
    const totalContacts = db.prepare('SELECT COUNT(*) as count FROM contacts').get();
    const totalCompanies = db.prepare('SELECT COUNT(*) as count FROM companies').get();
    const totalDeals = db.prepare('SELECT COUNT(*) as count FROM deals').get();
    const totalRevenue = db.prepare("SELECT SUM(value) as total FROM deals WHERE stage = 'Closed Won'").get();
    const pipelineValue = db.prepare("SELECT SUM(value) as total FROM deals WHERE stage NOT IN ('Closed Won', 'Closed Lost')").get();
    const activitiesThisMonth = db.prepare(`
      SELECT COUNT(*) as count FROM activities 
      WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
    `).get();
    const avgDealSize = db.prepare("SELECT AVG(value) as avg FROM deals WHERE stage = 'Closed Won'").get();
    const winRate = db.prepare(`
      SELECT 
        CAST(SUM(CASE WHEN stage = 'Closed Won' THEN 1 ELSE 0 END) AS FLOAT) / 
        CAST(COUNT(*) AS FLOAT) * 100 as rate
      FROM deals 
      WHERE stage IN ('Closed Won', 'Closed Lost')
    `).get();

    res.json({
      totalContacts: totalContacts.count,
      totalCompanies: totalCompanies.count,
      totalDeals: totalDeals.count,
      totalRevenue: totalRevenue.total || 0,
      pipelineValue: pipelineValue.total || 0,
      activitiesThisMonth: activitiesThisMonth.count,
      avgDealSize: avgDealSize.avg || 0,
      winRate: winRate.rate || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/deals-by-stage', (req, res) => {
  try {
    const dealsByStage = db.prepare(`
      SELECT stage, COUNT(*) as count, SUM(value) as total_value
      FROM deals
      GROUP BY stage
    `).all();

    res.json(dealsByStage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/recent-activities', (req, res) => {
  try {
    const activities = db.prepare(`
      SELECT a.*, c.first_name, c.last_name, comp.name as company_name
      FROM activities a
      LEFT JOIN contacts c ON a.contact_id = c.id
      LEFT JOIN companies comp ON a.company_id = comp.id
      ORDER BY a.created_at DESC
      LIMIT 10
    `).all();

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/revenue-trend', (req, res) => {
  try {
    const revenueTrend = db.prepare(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        SUM(CASE WHEN stage = 'Closed Won' THEN value ELSE 0 END) as revenue,
        COUNT(CASE WHEN stage = 'Closed Won' THEN 1 END) as deals_won
      FROM deals
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `).all();

    res.json(revenueTrend.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/industry-breakdown', (req, res) => {
  try {
    const industryData = db.prepare(`
      SELECT industry, COUNT(*) as count, SUM(revenue) as total_revenue
      FROM companies
      GROUP BY industry
      ORDER BY count DESC
    `).all();

    res.json(industryData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/contacts', (req, res) => {
  try {
    const contacts = db.prepare(`
      SELECT c.*, comp.name as company_name
      FROM contacts c
      LEFT JOIN companies comp ON c.company_id = comp.id
      ORDER BY c.created_at DESC
    `).all();

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/contacts/search', (req, res) => {
  try {
    const { q } = req.query;
    const contacts = db.prepare(`
      SELECT c.*, comp.name as company_name
      FROM contacts c
      LEFT JOIN companies comp ON c.company_id = comp.id
      WHERE c.first_name LIKE ? OR c.last_name LIKE ? OR c.email LIKE ? OR comp.name LIKE ?
      ORDER BY c.created_at DESC
    `).all(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/contacts/:id', (req, res) => {
  try {
    const contact = db.prepare(`
      SELECT c.*, comp.name as company_name
      FROM contacts c
      LEFT JOIN companies comp ON c.company_id = comp.id
      WHERE c.id = ?
    `).get(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const activities = db.prepare(`
      SELECT * FROM activities WHERE contact_id = ? ORDER BY created_at DESC
    `).all(req.params.id);

    const deals = db.prepare(`
      SELECT * FROM deals WHERE contact_id = ? ORDER BY created_at DESC
    `).all(req.params.id);

    res.json({ ...contact, activities, deals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contacts', (req, res) => {
  try {
    const { first_name, last_name, email, phone, title, company_id, linkedin, status } = req.body;
    const result = db.prepare(`
      INSERT INTO contacts (first_name, last_name, email, phone, title, company_id, linkedin, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(first_name, last_name, email, phone, title, company_id, linkedin, status || 'active');

    const newContact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/contacts/:id', (req, res) => {
  try {
    const { first_name, last_name, email, phone, title, company_id, linkedin, status } = req.body;
    db.prepare(`
      UPDATE contacts
      SET first_name = ?, last_name = ?, email = ?, phone = ?, title = ?, company_id = ?, linkedin = ?, status = ?
      WHERE id = ?
    `).run(first_name, last_name, email, phone, title, company_id, linkedin, status, req.params.id);

    const updatedContact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/contacts/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contacts/bulk-delete', (req, res) => {
  try {
    const { ids } = req.body;
    const placeholders = ids.map(() => '?').join(',');
    db.prepare(`DELETE FROM contacts WHERE id IN (${placeholders})`).run(...ids);
    res.json({ message: `${ids.length} contacts deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/companies', (req, res) => {
  try {
    const companies = db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM contacts WHERE company_id = c.id) as contact_count,
        (SELECT COUNT(*) FROM deals WHERE company_id = c.id) as deal_count
      FROM companies c
      ORDER BY c.created_at DESC
    `).all();

    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/companies/search', (req, res) => {
  try {
    const { q } = req.query;
    const companies = db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM contacts WHERE company_id = c.id) as contact_count,
        (SELECT COUNT(*) FROM deals WHERE company_id = c.id) as deal_count
      FROM companies c
      WHERE c.name LIKE ? OR c.industry LIKE ? OR c.city LIKE ?
      ORDER BY c.created_at DESC
    `).all(`%${q}%`, `%${q}%`, `%${q}%`);

    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/companies/:id', (req, res) => {
  try {
    const company = db.prepare('SELECT * FROM companies WHERE id = ?').get(req.params.id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const contacts = db.prepare('SELECT * FROM contacts WHERE company_id = ?').all(req.params.id);
    const deals = db.prepare('SELECT * FROM deals WHERE company_id = ?').all(req.params.id);
    const activities = db.prepare('SELECT * FROM activities WHERE company_id = ? ORDER BY created_at DESC').all(req.params.id);

    res.json({ ...company, contacts, deals, activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/companies', (req, res) => {
  try {
    const { name, industry, website, phone, email, address, city, state, country, employees, revenue } = req.body;
    const result = db.prepare(`
      INSERT INTO companies (name, industry, website, phone, email, address, city, state, country, employees, revenue)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, industry, website, phone, email, address, city, state, country, employees, revenue);

    const newCompany = db.prepare('SELECT * FROM companies WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/companies/:id', (req, res) => {
  try {
    const { name, industry, website, phone, email, address, city, state, country, employees, revenue } = req.body;
    db.prepare(`
      UPDATE companies
      SET name = ?, industry = ?, website = ?, phone = ?, email = ?, address = ?, city = ?, state = ?, country = ?, employees = ?, revenue = ?
      WHERE id = ?
    `).run(name, industry, website, phone, email, address, city, state, country, employees, revenue, req.params.id);

    const updatedCompany = db.prepare('SELECT * FROM companies WHERE id = ?').get(req.params.id);
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/companies/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM companies WHERE id = ?').run(req.params.id);
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/deals', (req, res) => {
  try {
    const deals = db.prepare(`
      SELECT d.*, 
        comp.name as company_name,
        c.first_name || ' ' || c.last_name as contact_name
      FROM deals d
      LEFT JOIN companies comp ON d.company_id = comp.id
      LEFT JOIN contacts c ON d.contact_id = c.id
      ORDER BY d.created_at DESC
    `).all();

    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/deals/:id', (req, res) => {
  try {
    const deal = db.prepare(`
      SELECT d.*, 
        comp.name as company_name,
        c.first_name || ' ' || c.last_name as contact_name
      FROM deals d
      LEFT JOIN companies comp ON d.company_id = comp.id
      LEFT JOIN contacts c ON d.contact_id = c.id
      WHERE d.id = ?
    `).get(req.params.id);

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const activities = db.prepare('SELECT * FROM activities WHERE deal_id = ? ORDER BY created_at DESC').all(req.params.id);

    res.json({ ...deal, activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/deals', (req, res) => {
  try {
    const { title, value, stage, probability, company_id, contact_id, expected_close_date, description } = req.body;
    const result = db.prepare(`
      INSERT INTO deals (title, value, stage, probability, company_id, contact_id, expected_close_date, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, value, stage, probability, company_id, contact_id, expected_close_date, description);

    const newDeal = db.prepare('SELECT * FROM deals WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newDeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/deals/:id', (req, res) => {
  try {
    const { title, value, stage, probability, company_id, contact_id, expected_close_date, description } = req.body;
    db.prepare(`
      UPDATE deals
      SET title = ?, value = ?, stage = ?, probability = ?, company_id = ?, contact_id = ?, expected_close_date = ?, description = ?
      WHERE id = ?
    `).run(title, value, stage, probability, company_id, contact_id, expected_close_date, description, req.params.id);

    const updatedDeal = db.prepare('SELECT * FROM deals WHERE id = ?').get(req.params.id);
    res.json(updatedDeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/deals/:id/stage', (req, res) => {
  try {
    const { stage } = req.body;
    const probabilities = { 'Prospecting': 10, 'Qualification': 25, 'Proposal': 50, 'Negotiation': 75, 'Closed Won': 100, 'Closed Lost': 0 };
    const probability = probabilities[stage] || 0;
    
    db.prepare(`
      UPDATE deals
      SET stage = ?, probability = ?
      WHERE id = ?
    `).run(stage, probability, req.params.id);

    const updatedDeal = db.prepare('SELECT * FROM deals WHERE id = ?').get(req.params.id);
    res.json(updatedDeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/deals/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM deals WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/activities', (req, res) => {
  try {
    const activities = db.prepare(`
      SELECT a.*, 
        c.first_name || ' ' || c.last_name as contact_name,
        comp.name as company_name,
        d.title as deal_title
      FROM activities a
      LEFT JOIN contacts c ON a.contact_id = c.id
      LEFT JOIN companies comp ON a.company_id = comp.id
      LEFT JOIN deals d ON a.deal_id = d.id
      ORDER BY a.due_date DESC
    `).all();

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/activities', (req, res) => {
  try {
    const { type, subject, description, contact_id, company_id, deal_id, completed, due_date } = req.body;
    const result = db.prepare(`
      INSERT INTO activities (type, subject, description, contact_id, company_id, deal_id, completed, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(type, subject, description, contact_id, company_id, deal_id, completed || 0, due_date);

    const newActivity = db.prepare('SELECT * FROM activities WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/activities/:id', (req, res) => {
  try {
    const { type, subject, description, contact_id, company_id, deal_id, completed, due_date } = req.body;
    db.prepare(`
      UPDATE activities
      SET type = ?, subject = ?, description = ?, contact_id = ?, company_id = ?, deal_id = ?, completed = ?, due_date = ?
      WHERE id = ?
    `).run(type, subject, description, contact_id, company_id, deal_id, completed, due_date, req.params.id);

    const updatedActivity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/activities/:id/complete', (req, res) => {
  try {
    const { completed } = req.body;
    db.prepare(`
      UPDATE activities
      SET completed = ?
      WHERE id = ?
    `).run(completed ? 1 : 0, req.params.id);

    const updatedActivity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/activities/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM activities WHERE id = ?').run(req.params.id);
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/email-templates', (req, res) => {
  try {
    const templates = db.prepare('SELECT * FROM email_templates ORDER BY created_at DESC').all();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/email-templates', (req, res) => {
  try {
    const { name, subject, body, category } = req.body;
    const result = db.prepare(`
      INSERT INTO email_templates (name, subject, body, category)
      VALUES (?, ?, ?, ?)
    `).run(name, subject, body, category);

    const newTemplate = db.prepare('SELECT * FROM email_templates WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/notifications', (req, res) => {
  try {
    const notifications = db.prepare('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50').all();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/notifications/unread', (req, res) => {
  try {
    const count = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE read = 0').get();
    res.json({ count: count.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/notifications/:id/read', (req, res) => {
  try {
    db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(req.params.id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/notifications/mark-all-read', (req, res) => {
  try {
    db.prepare('UPDATE notifications SET read = 1 WHERE read = 0').run();
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/preferences', (req, res) => {
  try {
    const preferences = db.prepare('SELECT * FROM user_preferences').all();
    const prefsObj = {};
    preferences.forEach(pref => {
      prefsObj[pref.key] = pref.value;
    });
    res.json(prefsObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/preferences', (req, res) => {
  try {
    const { key, value } = req.body;
    db.prepare(`
      INSERT OR REPLACE INTO user_preferences (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).run(key, value);
    res.json({ message: 'Preference saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/export/contacts', (req, res) => {
  try {
    const contacts = db.prepare(`
      SELECT c.*, comp.name as company_name
      FROM contacts c
      LEFT JOIN companies comp ON c.company_id = comp.id
    `).all();
    
    const csv = convertToCSV(contacts);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/export/companies', (req, res) => {
  try {
    const companies = db.prepare('SELECT * FROM companies').all();
    const csv = convertToCSV(companies);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=companies.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/export/deals', (req, res) => {
  try {
    const deals = db.prepare(`
      SELECT d.*, comp.name as company_name, c.first_name || ' ' || c.last_name as contact_name
      FROM deals d
      LEFT JOIN companies comp ON d.company_id = comp.id
      LEFT JOIN contacts c ON d.contact_id = c.id
    `).all();
    const csv = convertToCSV(deals);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=deals.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  csvRows.push(headers.join(','));
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return `"${value !== null && value !== undefined ? String(value).replace(/"/g, '""') : ''}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

app.listen(PORT, () => {
  console.log(`\n🚀 GrowthPartner CRM Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`\n✨ Enhanced Features Enabled:`);
  console.log(`   • Advanced Search & Filtering`);
  console.log(`   • Bulk Actions & CSV Export`);
  console.log(`   • Email Templates`);
  console.log(`   • Notifications System`);
  console.log(`   • User Preferences`);
  console.log(`   • Enhanced Analytics\n`);
});
