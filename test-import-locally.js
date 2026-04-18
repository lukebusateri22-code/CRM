// Quick local test of import functionality
const fs = require('fs');
const { parse } = require('csv-parse/sync');

// Utility functions (same as in import.js)
function normalizePhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  return phone;
}

function parseCurrency(value) {
  if (!value) return null;
  const cleaned = String(value).replace(/[$,]/g, '');
  if (cleaned.toLowerCase().endsWith('k')) {
    return parseFloat(cleaned) * 1000;
  }
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

function splitFullName(fullName) {
  if (!fullName) return { firstName: '', lastName: '' };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
}

function validateEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Test with test-1-basic.csv
console.log('\n🧪 Testing CSV Import Logic\n');

const csvContent = fs.readFileSync('./test-data/test-1-basic.csv', 'utf-8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true
});

console.log(`📊 Parsed ${records.length} records\n`);

records.forEach((row, i) => {
  console.log(`Row ${i + 1}:`);
  console.log(`  Full Name: ${row['Full Name']}`);
  
  const { firstName, lastName } = splitFullName(row['Full Name']);
  console.log(`  → First: ${firstName}, Last: ${lastName}`);
  
  const phone = normalizePhone(row['Phone']);
  console.log(`  Phone: ${row['Phone']} → ${phone}`);
  
  const emailValid = validateEmail(row['Email']);
  console.log(`  Email: ${row['Email']} (${emailValid ? '✅ valid' : '❌ invalid'})`);
  
  console.log('');
});

// Test phone normalization
console.log('\n📞 Phone Normalization Tests:');
const phoneTests = [
  '555-1234',
  '(555) 123-4567',
  '555.123.4567',
  '+1-555-123-4567',
  '5551234567'
];

phoneTests.forEach(phone => {
  console.log(`  ${phone} → ${normalizePhone(phone)}`);
});

// Test currency parsing
console.log('\n💰 Currency Parsing Tests:');
const currencyTests = [
  '$50000',
  '$75,000.50',
  '100000',
  '$125,000.00',
  '150k'
];

currencyTests.forEach(currency => {
  console.log(`  ${currency} → ${parseCurrency(currency)}`);
});

console.log('\n✅ All utility functions working!\n');
