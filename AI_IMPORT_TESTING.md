# AI Import Testing - Comprehensive Test Plan

## 🎯 Testing Objective

Make the AI-powered CSV import bulletproof by testing every possible edge case, error scenario, and data format.

---

## 📋 Test Cases

### **Test 1: Basic Happy Path**
**File:** `test-1-basic.csv`
**Data:** 3 simple contacts with standard fields
**Expected:**
- ✅ AI maps "Full Name" → first_name + last_name
- ✅ AI maps "Email" → email
- ✅ AI maps "Phone" → phone
- ✅ AI maps "Company" → company_name
- ✅ All 3 contacts imported successfully
- ✅ Companies created automatically

**Potential Issues:**
- Name splitting logic (what if no space?)
- Company creation (duplicate companies?)

---

### **Test 2: Edge Cases & Special Characters**
**File:** `test-2-edge-cases.csv`
**Data:** Problematic data that breaks most systems

**Test Cases:**
1. **Apostrophes in names:** "O'Brien, Patrick"
   - Expected: Handles single quotes correctly
   - Issue: SQL injection risk if not escaped

2. **Unicode characters:** "José García", "Café España"
   - Expected: Stores UTF-8 correctly
   - Issue: Database encoding problems

3. **Phone format variations:** "(555) 123-4567", "555.123.4567", "+1-555-123-4567"
   - Expected: Normalizes to standard format
   - Issue: Different formats not recognized

4. **Commas in company names:** "Tech, Inc."
   - Expected: Handles CSV escaping
   - Issue: CSV parsing breaks

5. **Empty required fields:** Missing name or email
   - Expected: Skips row with error message
   - Issue: Crashes import

6. **Duplicate rows:** Exact same data twice
   - Expected: Detects and asks user
   - Issue: Creates duplicates

**Critical Fixes Needed:**
- [ ] SQL injection prevention
- [ ] UTF-8 encoding support
- [ ] Phone number normalization
- [ ] CSV escaping handling
- [ ] Required field validation
- [ ] Duplicate detection

---

### **Test 3: Salesforce Export Format**
**File:** `test-3-salesforce-export.csv`
**Data:** Real Salesforce export format

**Column Mapping Tests:**
- "First Name" + "Last Name" → first_name, last_name
- "Account Name" → company_name
- "Lead Source" → custom field or skip
- "Created Date" → created_at or skip

**Expected:**
- ✅ Recognizes Salesforce format
- ✅ Maps standard fields correctly
- ✅ Handles unknown fields gracefully
- ✅ Preserves data integrity

**Potential Issues:**
- Unknown fields cause errors
- Date format not recognized
- Title field mapping unclear

---

### **Test 4: Real Estate Industry**
**File:** `test-4-real-estate.csv`
**Data:** Real estate specific fields

**Custom Field Tests:**
- "Property Address" → company_name (properties as companies)
- "Bedrooms", "Bathrooms", "Square Feet" → custom fields
- "Listing Price" → deal value
- "Agent Name" → contact

**Expected:**
- ✅ AI recognizes industry pattern
- ✅ Suggests creating custom fields
- ✅ Maps property data correctly
- ✅ Creates relationships (agent → property)

**Potential Issues:**
- Custom fields not supported yet
- Currency parsing ($450000 vs $450,000)
- Relationship creation complex

---

### **Test 5: Malformed CSV**
**File:** `test-5-malformed.csv`
**Data:** Intentionally broken CSV

**Error Cases:**
1. **Unclosed quotes:** `"Unclosed Quote,test@email.com`
   - Expected: Error message, skip row
   - Issue: Crashes parser

2. **Extra quotes:** `"Extra""Quotes""User"`
   - Expected: Handles escaped quotes
   - Issue: Parsing error

3. **Tabs instead of commas:** `Tab	User`
   - Expected: Detects delimiter
   - Issue: Treats as single field

4. **Line breaks in fields:** Multi-line values
   - Expected: Handles correctly
   - Issue: Splits into multiple rows

**Critical Fixes:**
- [ ] Robust CSV parser
- [ ] Error recovery
- [ ] Delimiter detection
- [ ] Multi-line field support

---

### **Test 6: Large Dataset (Performance)**
**File:** `test-6-large-dataset.csv`
**Data:** 10 rows (simulate 1000+)

**Performance Tests:**
- Import speed: < 1 second per 100 rows
- Memory usage: Doesn't crash on large files
- Progress indicator: Shows real-time progress
- Batch processing: Handles in chunks

**Expected:**
- ✅ Imports 1000 rows in < 10 seconds
- ✅ Shows progress bar
- ✅ Doesn't freeze browser
- ✅ Handles errors gracefully

**Potential Issues:**
- Timeout on large files
- Memory overflow
- No progress feedback
- All-or-nothing import (should be batched)

---

### **Test 7: Different Data Formats**
**File:** `test-7-different-formats.csv`
**Data:** Various date, currency, boolean formats

**Format Detection Tests:**

**Dates:**
- "01/15/2024" (MM/DD/YYYY)
- "2024-02-20" (ISO format)
- "15-Mar-2024" (DD-MMM-YYYY)
- "2024/04/10" (YYYY/MM/DD)
- "Apr 25 2024" (MMM DD YYYY)

**Currency:**
- "$50000" (no separator)
- "$75000.50" (decimal)
- "100000" (no symbol)
- "$125,000.00" (comma separator)
- "150k" (shorthand)

**Booleans:**
- "Yes" / "No"
- "TRUE" / "FALSE"
- "1" / "0"
- "Y" / "N"
- "true" / "false"

**Expected:**
- ✅ AI detects format patterns
- ✅ Converts to standard format
- ✅ Validates data types
- ✅ Shows warnings for ambiguous data

**Critical Fixes:**
- [ ] Date parser for multiple formats
- [ ] Currency parser (remove $, commas)
- [ ] Boolean normalization
- [ ] Type validation

---

## 🔧 Issues Found & Fixes

### **Issue 1: Database Not Connected**
**Status:** 🔴 Critical
**Impact:** Nothing saves, all imports fail
**Fix Required:** 
1. Connect to PostgreSQL database
2. Run migrations
3. Test connection

### **Issue 2: No Duplicate Detection**
**Status:** 🟡 High Priority
**Impact:** Creates duplicate contacts
**Fix Required:**
1. Check email before inserting
2. Ask user: Update or Skip
3. Merge data if updating

### **Issue 3: No Custom Fields Support**
**Status:** 🟡 High Priority
**Impact:** Can't import industry-specific data
**Fix Required:**
1. Add custom_fields table
2. Allow dynamic field creation
3. Store in JSON or separate table

### **Issue 4: Phone Number Not Normalized**
**Status:** 🟡 Medium Priority
**Impact:** Different formats stored inconsistently
**Fix Required:**
1. Strip all non-digits
2. Format as (XXX) XXX-XXXX
3. Validate length

### **Issue 5: Currency Not Parsed**
**Status:** 🟡 Medium Priority
**Impact:** "$50,000" stored as string, not number
**Fix Required:**
1. Remove $, commas
2. Parse as float
3. Store as number

### **Issue 6: No Error Recovery**
**Status:** 🟠 Medium Priority
**Impact:** One bad row fails entire import
**Fix Required:**
1. Wrap each row in try/catch
2. Continue on error
3. Report errors at end

### **Issue 7: No Progress Indicator**
**Status:** 🟢 Low Priority
**Impact:** User doesn't know if import is working
**Fix Required:**
1. Add progress bar
2. Show "X of Y rows processed"
3. Estimated time remaining

### **Issue 8: No Batch Processing**
**Status:** 🟢 Low Priority
**Impact:** Large files may timeout
**Fix Required:**
1. Process in batches of 100
2. Use async/await
3. Show incremental progress

---

## ✅ Testing Checklist

**Before Testing:**
- [ ] Database connected and migrations run
- [ ] Backend server running
- [ ] Frontend deployed
- [ ] Test CSV files created

**Basic Functionality:**
- [ ] Upload CSV file
- [ ] AI analyzes and suggests mapping
- [ ] Preview shows correct data
- [ ] Can adjust mapping manually
- [ ] Import button works
- [ ] Success message shows
- [ ] Data appears in contacts list

**Edge Cases:**
- [ ] Special characters (O'Brien, José)
- [ ] Empty fields handled gracefully
- [ ] Duplicate emails detected
- [ ] Phone formats normalized
- [ ] Currency parsed correctly
- [ ] Dates converted properly
- [ ] Malformed CSV shows errors

**Error Handling:**
- [ ] Invalid CSV shows clear error
- [ ] Missing required fields skip row
- [ ] Partial import succeeds
- [ ] Error report shows which rows failed
- [ ] Can retry failed rows

**Performance:**
- [ ] 100 rows imports in < 2 seconds
- [ ] 1000 rows imports in < 20 seconds
- [ ] Progress bar updates in real-time
- [ ] Browser doesn't freeze
- [ ] Memory usage reasonable

**User Experience:**
- [ ] Drag & drop works
- [ ] File upload button works
- [ ] Mapping interface intuitive
- [ ] Preview table readable
- [ ] Success/error messages clear
- [ ] Can import another file easily

---

## 🚀 Improvements to Build

### **Priority 1: Critical Fixes**
1. **Connect Database** - Nothing works without this
2. **Duplicate Detection** - Prevents data corruption
3. **Error Recovery** - One bad row shouldn't fail all

### **Priority 2: Data Quality**
1. **Phone Normalization** - Consistent format
2. **Currency Parsing** - Store as numbers
3. **Date Parsing** - Handle multiple formats
4. **Email Validation** - Prevent invalid emails

### **Priority 3: Advanced Features**
1. **Custom Fields** - Industry-specific data
2. **Relationship Detection** - Auto-link contacts to companies
3. **Duplicate Merging** - Smart merge of duplicate data
4. **Template Library** - Pre-built mappings for Salesforce, HubSpot

### **Priority 4: UX Improvements**
1. **Progress Bar** - Real-time feedback
2. **Batch Processing** - Handle large files
3. **Undo Import** - Rollback if needed
4. **Export Template** - Download sample CSV

---

## 📊 Test Results Template

```
Test: [Test Name]
File: [test-X-name.csv]
Date: [Date]
Status: ✅ Pass / ❌ Fail / ⚠️ Partial

Results:
- Rows processed: X
- Successful: X
- Failed: X
- Time taken: X seconds

Issues Found:
1. [Issue description]
2. [Issue description]

Fixes Applied:
1. [Fix description]
2. [Fix description]

Next Steps:
- [ ] Action item 1
- [ ] Action item 2
```

---

## 🎯 Success Criteria

**The AI Import is production-ready when:**

1. ✅ Can import 1000+ rows without errors
2. ✅ Handles all common CSV formats (Salesforce, HubSpot, Excel)
3. ✅ Detects and prevents duplicates
4. ✅ Normalizes phone, currency, date formats
5. ✅ Shows clear error messages for bad data
6. ✅ Recovers from errors gracefully
7. ✅ Provides real-time progress feedback
8. ✅ Completes in < 30 seconds for 1000 rows
9. ✅ Has been tested with 10+ real-world datasets
10. ✅ Zero data loss or corruption

---

## 📝 Next Actions

**Immediate (Now):**
1. Fix database connection
2. Test basic import flow
3. Fix critical bugs

**Short-term (This Week):**
1. Test all 7 test files
2. Fix all high-priority issues
3. Add duplicate detection
4. Add error recovery

**Medium-term (Next Week):**
1. Add custom fields support
2. Build template library
3. Add progress indicators
4. Optimize performance

**Long-term (Next Month):**
1. Add AI-powered duplicate merging
2. Add relationship detection
3. Add industry templates
4. Add export functionality

---

## 🎓 Lessons Learned

**What Works:**
- AI column mapping is accurate
- Preview interface is intuitive
- Drag & drop UX is smooth

**What Needs Work:**
- Database connection required
- Error handling too basic
- No duplicate detection
- Performance untested at scale

**Key Insights:**
- Data migration is THE killer feature
- Must handle messy real-world data
- Error recovery is critical
- Speed matters for large datasets
