require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./config/database');
const authRoutes = require('./routes/auth');
const importRoutes = require('./routes/import');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*'
    : '*',
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Auth routes (no authentication required)
app.use('/api/auth', authRoutes);

// Import routes (authentication required)
app.use('/api/import', importRoutes);

// Admin routes (admin authentication required)
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

// Basic info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'GrowthPartner CRM API',
    version: '2.0.0',
    features: [
      'PostgreSQL Database',
      'JWT Authentication',
      'Multi-tenant Architecture',
      'CSV Import with AI Mapping'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 GrowthPartner CRM Server v2.0`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n✨ Features Enabled:`);
  console.log(`   • PostgreSQL Database`);
  console.log(`   • JWT Authentication`);
  console.log(`   • Multi-tenant Architecture`);
  console.log(`   • AI-Powered CSV Import`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`   • POST /api/auth/signup - Create account`);
  console.log(`   • POST /api/auth/login - User login`);
  console.log(`   • GET  /api/auth/me - Get current user`);
  console.log(`   • POST /api/import/preview - Preview CSV`);
  console.log(`   • POST /api/import/contacts - Import contacts`);
  console.log(`   • POST /api/import/companies - Import companies`);
  console.log(`   • GET  /api/health - Health check`);
  console.log(`\n`);
});
