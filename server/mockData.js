const db = require('./database');

function clearDatabase() {
  db.exec(`
    DELETE FROM activities;
    DELETE FROM deals;
    DELETE FROM contacts;
    DELETE FROM companies;
  `);
}

function seedDatabase() {
  const checkCompanies = db.prepare('SELECT COUNT(*) as count FROM companies').get();
  if (checkCompanies.count > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  console.log('Seeding database with mock data...');

  const companies = [
    { name: 'Sunrise Bakery', industry: 'Food & Beverage', website: 'sunrisebakery.com', phone: '555-0101', email: 'info@sunrisebakery.com', city: 'Portland', state: 'OR', country: 'USA', employees: 8, revenue: 450000 },
    { name: 'Green Thumb Landscaping', industry: 'Landscaping', website: 'greenthumbland.com', phone: '555-0102', email: 'contact@greenthumbland.com', city: 'Austin', state: 'TX', country: 'USA', employees: 12, revenue: 680000 },
    { name: 'Coastal Coffee Roasters', industry: 'Coffee Shop', website: 'coastalcoffee.com', phone: '555-0103', email: 'hello@coastalcoffee.com', city: 'San Diego', state: 'CA', country: 'USA', employees: 6, revenue: 320000 },
    { name: 'Peak Performance Gym', industry: 'Fitness', website: 'peakperformancegym.com', phone: '555-0104', email: 'info@peakperformancegym.com', city: 'Denver', state: 'CO', country: 'USA', employees: 15, revenue: 890000 },
    { name: 'Artisan Furniture Co', industry: 'Manufacturing', website: 'artisanfurniture.com', phone: '555-0105', email: 'sales@artisanfurniture.com', city: 'Asheville', state: 'NC', country: 'USA', employees: 10, revenue: 720000 },
    { name: 'Happy Paws Pet Grooming', industry: 'Pet Services', website: 'happypawsgrooming.com', phone: '555-0106', email: 'contact@happypawsgrooming.com', city: 'Seattle', state: 'WA', country: 'USA', employees: 5, revenue: 280000 },
    { name: 'Urban Garden Supply', industry: 'Retail', website: 'urbangardensupply.com', phone: '555-0107', email: 'info@urbangardensupply.com', city: 'Chicago', state: 'IL', country: 'USA', employees: 9, revenue: 540000 },
    { name: 'Bright Minds Tutoring', industry: 'Education', website: 'brightmindstutoring.com', phone: '555-0108', email: 'hello@brightmindstutoring.com', city: 'Boston', state: 'MA', country: 'USA', employees: 7, revenue: 380000 },
    { name: 'Fresh Start Cleaning', industry: 'Cleaning Services', website: 'freshstartcleaning.com', phone: '555-0109', email: 'contact@freshstartcleaning.com', city: 'Phoenix', state: 'AZ', country: 'USA', employees: 18, revenue: 620000 },
    { name: 'Main Street Bookstore', industry: 'Retail', website: 'mainstreetbooks.com', phone: '555-0110', email: 'info@mainstreetbooks.com', city: 'Nashville', state: 'TN', country: 'USA', employees: 4, revenue: 240000 },
    { name: 'Precision Auto Repair', industry: 'Automotive', website: 'precisionautorepair.com', phone: '555-0111', email: 'service@precisionautorepair.com', city: 'Detroit', state: 'MI', country: 'USA', employees: 11, revenue: 780000 },
    { name: 'Bella Vista Restaurant', industry: 'Restaurant', website: 'bellavistarestaurant.com', phone: '555-0112', email: 'reservations@bellavistarestaurant.com', city: 'Miami', state: 'FL', country: 'USA', employees: 14, revenue: 920000 },
    { name: 'TechFix Solutions', industry: 'IT Services', website: 'techfixsolutions.com', phone: '555-0113', email: 'support@techfixsolutions.com', city: 'San Francisco', state: 'CA', country: 'USA', employees: 6, revenue: 450000 },
    { name: 'Cozy Corner Boutique', industry: 'Retail', website: 'cozycornerboutique.com', phone: '555-0114', email: 'hello@cozycornerboutique.com', city: 'Charleston', state: 'SC', country: 'USA', employees: 3, revenue: 180000 },
    { name: 'Summit Accounting Services', industry: 'Professional Services', website: 'summitaccounting.com', phone: '555-0115', email: 'info@summitaccounting.com', city: 'Salt Lake City', state: 'UT', country: 'USA', employees: 8, revenue: 520000 },
    { name: 'Wildflower Photography', industry: 'Photography', website: 'wildflowerphotography.com', phone: '555-0116', email: 'bookings@wildflowerphotography.com', city: 'Portland', state: 'ME', country: 'USA', employees: 2, revenue: 150000 },
    { name: 'Riverside Plumbing', industry: 'Construction', website: 'riversideplumbing.com', phone: '555-0117', email: 'contact@riversideplumbing.com', city: 'Minneapolis', state: 'MN', country: 'USA', employees: 13, revenue: 850000 },
    { name: 'Sweet Treats Bakery', industry: 'Food & Beverage', website: 'sweettreatsbakey.com', phone: '555-0118', email: 'orders@sweettreatsbakey.com', city: 'New Orleans', state: 'LA', country: 'USA', employees: 7, revenue: 410000 },
    { name: 'Harmony Yoga Studio', industry: 'Wellness', website: 'harmonyyogastudio.com', phone: '555-0119', email: 'info@harmonyyogastudio.com', city: 'Boulder', state: 'CO', country: 'USA', employees: 5, revenue: 290000 },
    { name: 'Elite Marketing Agency', industry: 'Marketing', website: 'elitemarketingagency.com', phone: '555-0120', email: 'hello@elitemarketingagency.com', city: 'Atlanta', state: 'GA', country: 'USA', employees: 9, revenue: 640000 }
  ];

  const insertCompany = db.prepare(`
    INSERT INTO companies (name, industry, website, phone, email, city, state, country, employees, revenue)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const companyIds = [];
  for (const company of companies) {
    const result = insertCompany.run(
      company.name, company.industry, company.website, company.phone, company.email,
      company.city, company.state, company.country, company.employees, company.revenue
    );
    companyIds.push(result.lastInsertRowid);
  }

  const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Jennifer', 'William', 'Amanda', 'James', 'Lisa', 'Daniel', 'Michelle', 'Christopher', 'Karen', 'Matthew', 'Nancy', 'Andrew', 'Betty', 'Joseph', 'Margaret', 'Ryan', 'Sandra', 'Kevin', 'Ashley', 'Brian', 'Donna', 'Thomas', 'Carol', 'Jason', 'Ruth', 'Timothy', 'Sharon', 'Steven', 'Laura', 'Eric', 'Deborah', 'Jeffrey', 'Cynthia', 'Mark', 'Angela', 'Paul', 'Melissa', 'Scott', 'Brenda', 'Richard', 'Amy', 'Charles', 'Anna'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen'];
  const titles = ['CEO', 'CTO', 'CFO', 'VP of Sales', 'VP of Marketing', 'Director of Operations', 'Head of Product', 'Sales Manager', 'Marketing Manager', 'Product Manager', 'Engineering Manager', 'Account Executive', 'Business Development Manager', 'Customer Success Manager', 'HR Director'];

  const insertContact = db.prepare(`
    INSERT INTO contacts (first_name, last_name, email, phone, title, company_id, linkedin, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const contactIds = [];
  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const companyId = companyIds[Math.floor(Math.random() * companyIds.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const phone = `555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    const linkedin = `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
    const status = Math.random() > 0.1 ? 'active' : 'inactive';

    const result = insertContact.run(firstName, lastName, email, phone, title, companyId, linkedin, status);
    contactIds.push(result.lastInsertRowid);
  }

  const dealTitles = [
    'Business Growth Strategy Package', 'Marketing & Brand Development', 'Financial Planning & Analysis',
    'Operations Optimization Consulting', 'Digital Transformation Program', 'Sales Process Improvement',
    'Customer Acquisition Strategy', 'Revenue Growth Consulting', 'Team Building & HR Support',
    'Social Media Marketing Package', 'Website Redesign & SEO', 'Business Plan Development',
    'Franchise Expansion Consulting', 'Process Automation Implementation', 'Leadership Coaching Program',
    'Market Research & Analysis', 'Competitive Analysis Package', 'Customer Retention Strategy',
    'E-commerce Setup & Training', 'Bookkeeping & Accounting Services', 'Inventory Management System',
    'Employee Training Program', 'Brand Identity Development', 'Strategic Partnership Development',
    'Annual Growth Consulting Retainer', 'Exit Strategy Planning', 'Merger & Acquisition Advisory',
    'Technology Integration Services', 'Crisis Management Consulting', 'Sustainability & ESG Consulting'
  ];

  const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const probabilities = { 'Prospecting': 10, 'Qualification': 25, 'Proposal': 50, 'Negotiation': 75, 'Closed Won': 100, 'Closed Lost': 0 };

  const insertDeal = db.prepare(`
    INSERT INTO deals (title, value, stage, probability, company_id, contact_id, expected_close_date, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const dealIds = [];
  for (let i = 0; i < 30; i++) {
    const title = dealTitles[Math.floor(Math.random() * dealTitles.length)];
    const value = Math.floor(Math.random() * 45000) + 5000;
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const probability = probabilities[stage];
    const companyId = companyIds[Math.floor(Math.random() * companyIds.length)];
    const contactId = contactIds[Math.floor(Math.random() * contactIds.length)];
    const daysToClose = Math.floor(Math.random() * 90) + 1;
    const expectedCloseDate = new Date(Date.now() + daysToClose * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const description = `Helping small business grow with ${title.toLowerCase()}`;

    const result = insertDeal.run(title, value, stage, probability, companyId, contactId, expectedCloseDate, description);
    dealIds.push(result.lastInsertRowid);
  }

  const activityTypes = ['Call', 'Email', 'Meeting', 'Task', 'Note'];
  const subjects = [
    'Initial discovery call', 'Growth strategy consultation', 'Proposal review meeting', 'Contract signing',
    'Quarterly progress review', 'Introduction call', 'Business assessment discussion', 'Proposal presentation',
    'Strategy planning session', 'Onboarding kickoff', 'Training workshop', 'Follow-up on action items',
    'Revenue analysis review', 'Marketing plan discussion', 'Check-in call', 'Success metrics review',
    'Expansion opportunity discussion', 'Client testimonial request', 'Case study interview',
    'Referral discussion', 'Goal setting session', 'Performance review', 'Feedback and adjustments'
  ];

  const insertActivity = db.prepare(`
    INSERT INTO activities (type, subject, description, contact_id, company_id, deal_id, completed, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 0; i < 100; i++) {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const description = `${type} regarding ${subject}`;
    const contactId = contactIds[Math.floor(Math.random() * contactIds.length)];
    const companyId = companyIds[Math.floor(Math.random() * companyIds.length)];
    const dealId = Math.random() > 0.5 ? dealIds[Math.floor(Math.random() * dealIds.length)] : null;
    const completed = Math.random() > 0.3 ? 1 : 0;
    const daysOffset = Math.floor(Math.random() * 60) - 30;
    const dueDate = new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000).toISOString();

    insertActivity.run(type, subject, description, contactId, companyId, dealId, completed, dueDate);
  }

  const notifications = [
    { type: 'activity', title: 'Upcoming Meeting', message: 'Strategy planning session with Peak Performance Gym tomorrow at 2 PM', read: 0, link: '/activities' },
    { type: 'deal', title: 'Deal Stage Changed', message: 'Marketing & Brand Development moved to Negotiation stage', read: 0, link: '/deals' },
    { type: 'activity', title: 'Overdue Task', message: 'Follow-up call with Sunrise Bakery is overdue', read: 0, link: '/activities' },
    { type: 'contact', title: 'New Contact Added', message: 'Sarah Johnson from Coastal Coffee Roasters was added to your contacts', read: 1, link: '/contacts' },
    { type: 'deal', title: 'Deal Won!', message: 'Business Growth Strategy Package closed successfully - $25,000', read: 1, link: '/deals' },
  ];

  const insertNotification = db.prepare(`
    INSERT INTO notifications (type, title, message, read, link)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const notif of notifications) {
    insertNotification.run(notif.type, notif.title, notif.message, notif.read, notif.link);
  }

  console.log('Database seeded successfully!');
  console.log(`- ${companyIds.length} companies`);
  console.log(`- ${contactIds.length} contacts`);
  console.log(`- ${dealIds.length} deals`);
  console.log('- 100 activities');
  console.log(`- ${notifications.length} notifications`);
}

module.exports = { seedDatabase, clearDatabase };
