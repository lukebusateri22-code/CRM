# Multi-Tenant Testing Guide

## 🎯 Understanding Multi-Tenancy

Your CRM is now **multi-tenant**, meaning multiple companies can use the same application with completely isolated data.

### **How It Works:**
- Each company gets their own **organization** record
- All data (contacts, companies, deals) is tagged with `organization_id`
- Users can only see data from their own organization
- Database queries automatically filter by `organization_id`

---

## 🧪 Testing Data Isolation

### **Test 1: Create Two Organizations**

**Organization A:**
```json
{
  "organizationName": "Acme Corp",
  "email": "admin@acme.com",
  "password": "acme123",
  "firstName": "John",
  "lastName": "Acme"
}
```

**Organization B:**
```json
{
  "organizationName": "TechStart Inc",
  "email": "admin@techstart.com",
  "password": "tech123",
  "firstName": "Jane",
  "lastName": "Tech"
}
```

### **Test 2: Add Data to Organization A**

**Login as:** `admin@acme.com`

**Create contacts:**
- Contact 1: "Alice Johnson" at "Acme Corp"
- Contact 2: "Bob Smith" at "Acme Corp"

**Create companies:**
- Company 1: "Acme Manufacturing"
- Company 2: "Acme Services"

**Create deals:**
- Deal 1: "$50,000 - New Equipment"
- Deal 2: "$25,000 - Consulting"

### **Test 3: Add Data to Organization B**

**Login as:** `admin@techstart.com`

**Create contacts:**
- Contact 1: "Charlie Brown" at "TechStart Inc"
- Contact 2: "Diana Prince" at "TechStart Inc"

**Create companies:**
- Company 1: "TechStart Labs"
- Company 2: "TechStart Solutions"

**Create deals:**
- Deal 1: "$100,000 - Software License"
- Deal 2: "$75,000 - Implementation"

### **Test 4: Verify Data Isolation**

**Login as Organization A (`admin@acme.com`):**
- ✅ Should see: Alice, Bob (contacts)
- ✅ Should see: Acme Manufacturing, Acme Services (companies)
- ✅ Should see: $50k, $25k deals
- ❌ Should NOT see: Charlie, Diana
- ❌ Should NOT see: TechStart Labs, TechStart Solutions
- ❌ Should NOT see: $100k, $75k deals

**Login as Organization B (`admin@techstart.com`):**
- ✅ Should see: Charlie, Diana (contacts)
- ✅ Should see: TechStart Labs, TechStart Solutions (companies)
- ✅ Should see: $100k, $75k deals
- ❌ Should NOT see: Alice, Bob
- ❌ Should NOT see: Acme Manufacturing, Acme Services
- ❌ Should NOT see: $50k, $25k deals

---

## 🔐 Security Testing

### **Test 5: API Token Isolation**

**Get Organization A's token:**
```bash
# Login as Acme
curl -X POST https://web-production-98929.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acme.com","password":"acme123"}'
```

**Try to access data with Organization A's token:**
```bash
# Should only return Acme's contacts
curl https://web-production-98929.up.railway.app/api/contacts \
  -H "Authorization: Bearer <acme-token>"
```

**Verify:**
- ✅ Returns only Acme's contacts
- ❌ Does NOT return TechStart's contacts

### **Test 6: Direct Database Queries**

**Check organization_id is set on all records:**
```sql
-- All contacts should have organization_id
SELECT COUNT(*) FROM contacts WHERE organization_id IS NULL;
-- Should return 0

-- Verify data is separated
SELECT o.name, COUNT(c.id) as contact_count
FROM organizations o
LEFT JOIN contacts c ON o.id = c.organization_id
GROUP BY o.id, o.name;
```

---

## 📊 Admin Panel Testing

### **Test 7: Admin Can See All Organizations**

**Login as your admin account:**
- Email: `lukebusateri22@gmail.com`
- Password: `Test123`

**Go to `/admin`:**
- ✅ Should see all organizations (Acme Corp, TechStart Inc, etc.)
- ✅ Should see total user count per organization
- ✅ Should see total data count per organization

### **Test 8: Create New Organization via Admin Panel**

**Use "Create Account" tab:**
```
Company Name: Beta Industries
First Name: Sarah
Last Name: Beta
Email: admin@beta.com
Password: beta123
Plan: Professional
```

**Verify:**
- ✅ New organization created
- ✅ Admin user created
- ✅ Can login with admin@beta.com
- ✅ Starts with empty data (no contacts/companies/deals)

### **Test 9: Reset User Password**

**In Admin Panel → Users tab:**
1. Find a user
2. Click reset password icon
3. Enter new password
4. Logout and login with new password
5. ✅ Should work

### **Test 10: Delete Organization**

**In Admin Panel → Organizations tab:**
1. Click delete on a test organization
2. Confirm deletion
3. ✅ Organization removed
4. ✅ All associated data deleted (contacts, companies, deals, users)
5. ✅ User can no longer login

---

## 🚀 Production Onboarding Flow

### **How to Onboard a New Client:**

**Step 1: Close the Deal**
- Sign contract with new client company

**Step 2: Create Their Account (Admin Panel)**
1. Login to your admin account
2. Go to `/admin`
3. Click "Create Account" tab
4. Fill in:
   - Company Name: [Client's company name]
   - Admin Name: [Their main contact]
   - Email: [Their admin email]
   - Password: [Temporary password]
   - Plan: [Based on contract]
5. Click "Create Organization"

**Step 3: Send Credentials to Client**
```
Subject: Welcome to GrowthPartner CRM

Hi [Client Name],

Your CRM account is ready!

Login URL: https://cozy-dodol-7dd2db.netlify.app/login
Email: [their-email]
Temporary Password: [temp-password]

Please change your password after first login.

Best regards,
GrowthPartner Team
```

**Step 4: Client Onboards Their Data**

**Option A: CSV Import (Recommended)**
- Client exports contacts from their current system (Excel, Salesforce, etc.)
- They upload CSV via the CRM import feature
- AI auto-maps columns
- Data imported instantly

**Option B: Manual Entry**
- Client uses "Add Contact", "Add Company", "Add Deal" buttons
- Enters data one by one

**Option C: API Integration**
- For tech-savvy clients
- They use the REST API to bulk import
- Can sync with their existing systems

---

## 🎯 Real-World Scenarios

### **Scenario 1: Real Estate Agency**

**Client:** "Sunset Realty"
**Users:** 5 agents
**Data:** 500 contacts, 200 properties (companies), 50 active deals

**Setup:**
1. Create organization: "Sunset Realty"
2. Create admin: agent@sunsetrealty.com
3. Admin invites 4 more agents (future feature)
4. Import 500 contacts from Excel
5. Import 200 properties as "companies"
6. Manually create 50 deals

**Isolation Test:**
- Sunset Realty sees ONLY their 500 contacts
- Other agencies see NONE of Sunset's data

### **Scenario 2: Consulting Firm**

**Client:** "Strategy Partners"
**Users:** 10 consultants
**Data:** 1,000 contacts, 100 client companies, 200 projects (deals)

**Setup:**
1. Create organization: "Strategy Partners"
2. Create admin: partner@strategypartners.com
3. Import contacts from Salesforce CSV
4. Import companies from their database
5. Create deals for active projects

**Isolation Test:**
- Strategy Partners sees ONLY their data
- Completely separate from all other clients

### **Scenario 3: Startup Accelerator**

**Client:** "Launch Pad Ventures"
**Users:** 3 partners
**Data:** 2,000 startup contacts, 500 startups (companies), 100 investment deals

**Setup:**
1. Create organization: "Launch Pad Ventures"
2. Create admin: partner@launchpad.vc
3. Import startup database
4. Track investments as deals

**Isolation Test:**
- Launch Pad sees ONLY their startup data
- Other VCs see NONE of their deal flow

---

## 🔍 Common Issues & Solutions

### **Issue 1: User sees data from another organization**
**Cause:** Missing `organization_id` filter in query
**Solution:** Check backend code - ALL queries must filter by `organization_id`

### **Issue 2: Can't create new organization**
**Cause:** Email already exists
**Solution:** Each email can only belong to ONE organization

### **Issue 3: Data not showing after import**
**Cause:** Import didn't set `organization_id`
**Solution:** Check import code sets `organization_id` from JWT token

### **Issue 4: Admin can't see all organizations**
**Cause:** User role is not 'admin' or 'super_admin'
**Solution:** Update user role in database

---

## 📈 Scaling Considerations

### **Current Limits (Per Organization):**
- Starter: 1,000 contacts, 2 users
- Professional: 10,000 contacts, 10 users
- Enterprise: Unlimited contacts, unlimited users

### **Database Performance:**
- PostgreSQL can handle millions of records
- Indexes on `organization_id` ensure fast queries
- Each organization's data is isolated

### **Future Enhancements:**
1. **Team Members** - Invite multiple users per organization
2. **Role Permissions** - Admin, Manager, User roles
3. **Data Export** - Download all data as CSV
4. **API Keys** - Per-organization API access
5. **White-Label** - Custom branding per organization
6. **Webhooks** - Real-time data sync

---

## ✅ Testing Checklist

Before launching to production, verify:

- [ ] Created 2+ test organizations
- [ ] Added data to each organization
- [ ] Verified data isolation (can't see other org's data)
- [ ] Tested login/logout for each organization
- [ ] Tested admin panel can see all organizations
- [ ] Tested creating new organization via admin panel
- [ ] Tested password reset
- [ ] Tested deleting organization
- [ ] Tested CSV import for each organization
- [ ] Verified API tokens are organization-specific
- [ ] Checked database has `organization_id` on all records
- [ ] Tested with real client data (anonymized)

---

## 🎓 Summary

**Your CRM is now a true multi-tenant SaaS platform!**

✅ Multiple companies can use it simultaneously
✅ Data is completely isolated
✅ Admin panel for easy client onboarding
✅ Scalable to hundreds of organizations
✅ Production-ready architecture

**Next Steps:**
1. Test data isolation with 2-3 organizations
2. Onboard your first real client
3. Monitor for any data leakage
4. Add team member invites (Phase 4)
5. Add Stripe payments (Phase 5)
