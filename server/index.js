const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const { seedDatabase } = require('./mockData');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

seedDatabase();

app.get('/api/dashboard/stats', (req, res) => {
  try {
    const totalContacts = db.prepare('SELECT COUNT(*) as count FROM contacts').get();
    const totalCompanies = db.prepare('SELECT COUNT(*) as count FROM companies').get();
    const totalDeals = db.prepare('SELECT COUNT(*) as count FROM deals').get();
    const totalRevenue = db.prepare('SELECT SUM(value) as total FROM deals WHERE stage = "Closed Won"').get();
    const pipelineValue = db.prepare('SELECT SUM(value) as total FROM deals WHERE stage NOT IN ("Closed Won", "Closed Lost")').get();
    const activitiesThisMonth = db.prepare(`
      SELECT COUNT(*) as count FROM activities 
      WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
    `).get();

    res.json({
      totalContacts: totalContacts.count,
      totalCompanies: totalCompanies.count,
      totalDeals: totalDeals.count,
      totalRevenue: totalRevenue.total || 0,
      pipelineValue: pipelineValue.total || 0,
      activitiesThisMonth: activitiesThisMonth.count
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

app.delete('/api/activities/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM activities WHERE id = ?').run(req.params.id);
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 CRM Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
