// Generate large test CSV files for stress testing
const fs = require('fs');

// Helper to generate random data
const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary', 'William', 'Jennifer', 'Richard', 'Patricia', 'Charles', 'Linda', 'Joseph', 'Barbara', 'Thomas', 'Elizabeth', 'Christopher', 'Susan', 'Daniel', 'Jessica', 'Matthew', 'Karen', 'Anthony', 'Nancy', 'Mark', 'Betty'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];
const companies = ['Acme Corp', 'Tech Innovations', 'Global Solutions', 'Digital Dynamics', 'Smart Systems', 'Future Tech', 'Alpha Industries', 'Beta Solutions', 'Gamma Corp', 'Delta Enterprises', 'Epsilon Inc', 'Zeta Technologies', 'Eta Consulting', 'Theta Group', 'Iota Partners', 'Kappa LLC', 'Lambda Co', 'Mu Industries', 'Nu Systems', 'Xi Corporation'];
const titles = ['CEO', 'CTO', 'VP Sales', 'Director', 'Manager', 'Senior Developer', 'Product Manager', 'Marketing Director', 'Sales Representative', 'Account Executive', 'Business Analyst', 'Project Manager', 'Software Engineer', 'Data Scientist', 'UX Designer'];
const domains = ['email.com', 'company.com', 'business.net', 'corp.io', 'tech.co', 'solutions.com', 'global.net', 'digital.io'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone() {
  const formats = [
    () => `(${Math.floor(Math.random() * 900 + 100)}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    () => `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    () => `${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 9000 + 1000)}`,
    () => `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`
  ];
  return randomElement(formats)();
}

function randomRevenue() {
  const formats = [
    () => `$${Math.floor(Math.random() * 900000 + 100000)}`,
    () => `$${Math.floor(Math.random() * 900 + 100)},000`,
    () => `${Math.floor(Math.random() * 500 + 50)}k`,
    () => `$${Math.floor(Math.random() * 900 + 100)},${Math.floor(Math.random() * 900 + 100)}.00`
  ];
  return randomElement(formats)();
}

console.log('🏗️  Generating large test datasets...\n');

// 1. Large Salesforce-style export (1000 rows)
console.log('📊 Generating test-8-salesforce-1000.csv (1000 contacts)...');
let csv = 'First Name,Last Name,Email,Phone,Account Name,Title,Lead Source,Annual Revenue,Created Date\n';
for (let i = 0; i < 1000; i++) {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${randomElement(domains)}`;
  const phone = randomPhone();
  const company = randomElement(companies);
  const title = randomElement(titles);
  const source = randomElement(['Website', 'Referral', 'Cold Call', 'LinkedIn', 'Conference', 'Partner']);
  const revenue = randomRevenue();
  const date = `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
  
  csv += `${firstName},${lastName},${email},${phone},${company},${title},${source},${revenue},${date}\n`;
}
fs.writeFileSync('./test-data/test-8-salesforce-1000.csv', csv);
console.log('✅ Created 1000 rows\n');

// 2. Large HubSpot-style export (2000 rows)
console.log('📊 Generating test-9-hubspot-2000.csv (2000 contacts)...');
csv = 'Contact Name,Email Address,Phone Number,Company Name,Job Title,Lifecycle Stage,Lead Status,Deal Amount\n';
for (let i = 0; i < 2000; i++) {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const fullName = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${randomElement(domains)}`;
  const phone = randomPhone();
  const company = randomElement(companies);
  const title = randomElement(titles);
  const stage = randomElement(['Lead', 'MQL', 'SQL', 'Opportunity', 'Customer']);
  const status = randomElement(['New', 'Working', 'Nurturing', 'Qualified', 'Unqualified']);
  const amount = randomRevenue();
  
  csv += `${fullName},${email},${phone},${company},${title},${stage},${status},${amount}\n`;
}
fs.writeFileSync('./test-data/test-9-hubspot-2000.csv', csv);
console.log('✅ Created 2000 rows\n');

// 3. Large dataset with special characters (500 rows)
console.log('📊 Generating test-10-special-chars-500.csv (500 contacts with edge cases)...');
const specialFirstNames = ['José', 'María', 'François', 'Søren', 'Müller', 'O\'Brien', 'Jean-Pierre', 'Anne-Marie', 'Björn', 'Łukasz'];
const specialLastNames = ['García', 'Rodríguez', 'Müller', 'O\'Reilly', 'Søndergaard', 'Łukaszewski', 'Château', 'Peña', 'Niño', 'São'];
const specialCompanies = ['Café España', 'O\'Reilly & Sons', 'Müller GmbH', 'François & Co', 'Tech, Inc.', 'Smith & Jones, LLC', '"Quoted" Company', 'Company (Parentheses)'];

csv = 'Full Name,Email,Phone,Company,Notes\n';
for (let i = 0; i < 500; i++) {
  const firstName = i % 3 === 0 ? randomElement(specialFirstNames) : randomElement(firstNames);
  const lastName = i % 3 === 0 ? randomElement(specialLastNames) : randomElement(lastNames);
  const fullName = `${firstName} ${lastName}`;
  const email = `contact${i}@${randomElement(domains)}`;
  const phone = randomPhone();
  const company = i % 4 === 0 ? randomElement(specialCompanies) : randomElement(companies);
  const notes = i % 5 === 0 ? 'Special chars: @#$%^&*()' : 'Standard contact';
  
  csv += `"${fullName}","${email}","${phone}","${company}","${notes}"\n`;
}
fs.writeFileSync('./test-data/test-10-special-chars-500.csv', csv);
console.log('✅ Created 500 rows with special characters\n');

// 4. Mixed format dataset (1500 rows)
console.log('📊 Generating test-11-mixed-formats-1500.csv (1500 contacts)...');
csv = 'Name,Email,Phone,Company,Revenue,Start Date,Active\n';
for (let i = 0; i < 1500; i++) {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const fullName = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${randomElement(domains)}`;
  const phone = randomPhone();
  const company = randomElement(companies);
  const revenue = randomRevenue();
  
  // Different date formats
  const dateFormats = [
    () => `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/2024`,
    () => `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${Math.floor(Math.random() * 28) + 1}-${randomElement(months)}-2024`;
    },
    () => `2024/${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}`
  ];
  const date = randomElement(dateFormats)();
  
  // Different boolean formats
  const active = randomElement(['Yes', 'No', 'TRUE', 'FALSE', '1', '0', 'Y', 'N', 'true', 'false']);
  
  csv += `${fullName},${email},${phone},${company},${revenue},${date},${active}\n`;
}
fs.writeFileSync('./test-data/test-11-mixed-formats-1500.csv', csv);
console.log('✅ Created 1500 rows with mixed formats\n');

// 5. Real estate dataset (800 rows)
console.log('📊 Generating test-12-real-estate-800.csv (800 properties)...');
const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Maple Dr', 'Cedar Ln', 'Elm St', 'Park Ave', 'Lake Dr', 'Hill Rd', 'River St'];
const cities = ['San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas'];
const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
const propertyTypes = ['House', 'Condo', 'Apartment', 'Townhouse', 'Villa'];
const statuses = ['Active', 'Pending', 'Sold', 'Off Market'];

csv = 'Agent Name,Phone,Email,Property Address,City,State,Bedrooms,Bathrooms,Square Feet,Listing Price,Property Type,Status\n';
for (let i = 0; i < 800; i++) {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const agentName = `${firstName} ${lastName}`;
  const phone = randomPhone();
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@realty.com`;
  const address = `${Math.floor(Math.random() * 9000) + 1000} ${randomElement(streets)}`;
  const city = randomElement(cities);
  const state = randomElement(states);
  const bedrooms = Math.floor(Math.random() * 5) + 1;
  const bathrooms = Math.floor(Math.random() * 4) + 1;
  const sqft = Math.floor(Math.random() * 3000) + 800;
  const price = `$${Math.floor(Math.random() * 900000) + 100000}`;
  const type = randomElement(propertyTypes);
  const status = randomElement(statuses);
  
  csv += `${agentName},${phone},${email},"${address}",${city},${state},${bedrooms},${bathrooms},${sqft},${price},${type},${status}\n`;
}
fs.writeFileSync('./test-data/test-12-real-estate-800.csv', csv);
console.log('✅ Created 800 rows\n');

// 6. Extreme stress test (5000 rows)
console.log('📊 Generating test-13-stress-5000.csv (5000 contacts - STRESS TEST)...');
csv = 'First Name,Last Name,Email,Phone,Company,Title,Revenue,Created Date\n';
for (let i = 0; i < 5000; i++) {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const email = `user${i}@${randomElement(domains)}`;
  const phone = randomPhone();
  const company = randomElement(companies);
  const title = randomElement(titles);
  const revenue = randomRevenue();
  const date = `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
  
  csv += `${firstName},${lastName},${email},${phone},${company},${title},${revenue},${date}\n`;
}
fs.writeFileSync('./test-data/test-13-stress-5000.csv', csv);
console.log('✅ Created 5000 rows\n');

console.log('🎉 All test files generated!\n');
console.log('📊 Summary:');
console.log('   • test-8-salesforce-1000.csv: 1,000 rows (Salesforce format)');
console.log('   • test-9-hubspot-2000.csv: 2,000 rows (HubSpot format)');
console.log('   • test-10-special-chars-500.csv: 500 rows (Special characters)');
console.log('   • test-11-mixed-formats-1500.csv: 1,500 rows (Mixed date/currency formats)');
console.log('   • test-12-real-estate-800.csv: 800 rows (Real estate data)');
console.log('   • test-13-stress-5000.csv: 5,000 rows (Stress test)');
console.log('\n   Total: 10,800 test records!\n');
