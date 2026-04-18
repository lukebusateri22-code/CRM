# 🚀 CRM Setup Guide - Production Database & Authentication

## 📋 Prerequisites

1. **Railway Account** (for PostgreSQL database)
2. **GitHub Account** (already set up)
3. **Netlify Account** (already set up)

---

## 🗄️ Step 1: Set Up PostgreSQL Database on Railway

### **1. Create PostgreSQL Database:**

1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Provision PostgreSQL"**
4. Wait for database to provision (~30 seconds)

### **2. Get Database Connection String:**

1. Click on your PostgreSQL service
2. Go to **"Variables"** tab
3. Copy the **`DATABASE_URL`** value
   - Format: `postgresql://user:pass@host:port/dbname`

### **3. Run Database Migration:**

**Option A: Using Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run migration
railway run psql < server/migrations/001_initial_schema.sql
```

**Option B: Using psql directly**
```bash
# Install PostgreSQL client
# Mac: brew install postgresql
# Ubuntu: sudo apt-get install postgresql-client

# Run migration
psql "postgresql://user:pass@host:port/dbname" < server/migrations/001_initial_schema.sql
```

**Option C: Using Railway Dashboard**
1. Go to your PostgreSQL service in Railway
2. Click **"Data"** tab
3. Click **"Query"** 
4. Copy/paste contents of `server/migrations/001_initial_schema.sql`
5. Click **"Run"**

---

## 🔐 Step 2: Update Environment Variables

### **Backend (Railway):**

Add these variables to your Railway backend service:

```
DATABASE_URL=<your-postgresql-connection-string>
JWT_SECRET=<generate-random-string-here>
NODE_ENV=production
FRONTEND_URL=https://cozy-dodol-7dd2db.netlify.app
```

**Generate JWT Secret:**
```bash
# Run this in terminal to generate a secure random string
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **Frontend (Netlify):**

Your existing variable:
```
REACT_APP_API_URL=https://web-production-98939.up.railway.app
```

---

## 📦 Step 3: Install New Dependencies

```bash
# In the root directory
npm install

# This installs:
# - pg (PostgreSQL client)
# - jsonwebtoken (JWT auth)
# - bcrypt (password hashing)
# - csv-parse (CSV import)
# - multer (file uploads)
# - dotenv (environment variables)
```

---

## 🧪 Step 4: Test Locally (Optional)

### **1. Set up local PostgreSQL:**
```bash
# Mac
brew install postgresql
brew services start postgresql
createdb crm_db

# Ubuntu
sudo apt-get install postgresql
sudo service postgresql start
sudo -u postgres createdb crm_db
```

### **2. Create .env file:**
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost:5432/crm_db
JWT_SECRET=your-local-secret-key
```

### **3. Run migration locally:**
```bash
psql crm_db < server/migrations/001_initial_schema.sql
```

### **4. Start development:**
```bash
npm run dev
```

---

## 🚀 Step 5: Deploy to Production

### **1. Commit and push:**
```bash
git add .
git commit -m "Add PostgreSQL database and authentication"
git push origin main
```

### **2. Railway will auto-deploy:**
- Backend redeploys automatically
- New dependencies installed
- Database connected

### **3. Netlify will auto-deploy:**
- Frontend rebuilds
- New authentication UI deployed

---

## ✅ Step 6: Verify Deployment

### **1. Check Railway Logs:**
```
✅ Database connected successfully
🚀 GrowthPartner CRM Server running on...
```

### **2. Test Authentication:**

**Sign Up:**
```bash
curl -X POST https://web-production-98939.up.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "organizationName": "Test Company",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "organizationId": "uuid-here"
  }
}
```

**Login:**
```bash
curl -X POST https://web-production-98939.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🔧 Troubleshooting

### **Database Connection Failed:**
```
Error: Connection refused
```
**Solution:** Check DATABASE_URL is correct in Railway variables

### **Migration Failed:**
```
Error: relation "organizations" already exists
```
**Solution:** Migration already ran, you're good!

### **JWT Token Invalid:**
```
Error: Invalid token
```
**Solution:** Make sure JWT_SECRET is set in Railway

### **CORS Error:**
```
Access-Control-Allow-Origin error
```
**Solution:** Check FRONTEND_URL matches your Netlify URL exactly

---

## 📊 Database Schema Overview

```
organizations (tenants)
  ├── users (authentication)
  ├── companies
  │     └── contacts
  │           └── deals
  ├── activities
  ├── email_templates
  └── notifications
```

**Key Features:**
- ✅ Multi-tenant architecture
- ✅ UUID primary keys
- ✅ Automatic timestamps
- ✅ Cascade deletes
- ✅ Indexed for performance
- ✅ Role-based access control

---

## 🎯 Next Steps

1. **Create your first account** at the live URL
2. **Import your data** using CSV import
3. **Invite team members** (coming soon)
4. **Set up integrations** (coming soon)

---

## 🆘 Need Help?

- Check Railway logs: `railway logs`
- Check Netlify deploy logs in dashboard
- Review this guide again
- Check `SAAS_ARCHITECTURE.md` for more details

---

**Your CRM is now running on a production-grade PostgreSQL database with full authentication!** 🎉
