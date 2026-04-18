# 🚀 Enterprise CRM Application

A modern, full-stack CRM application with enterprise-level features built with React, Node.js, and SQLite.

**✨ Production-Ready | 🎨 Beautiful UI | ⚡ Lightning Fast | 🔒 Secure**

## 🎯 Features

### Core CRM
- 📊 **Dashboard** - Real-time analytics and insights
- 👥 **Contacts** - Complete contact management with details
- 🏢 **Companies** - Organization and account tracking
- 💰 **Deals** - Visual sales pipeline with Kanban board
- 📝 **Activities** - Calls, meetings, emails, and tasks
- 📅 **Calendar** - Activity calendar with multiple views
- ✅ **Task Board** - Jira-style task management

### Advanced Features
- ⚡ **Workflow Automation** - 6 pre-built workflows with templates
- 📊 **Custom Reports** - 4 report types with charts and export
- 🤖 **AI Analytics** - AI-powered insights and forecasting
- � **AI Chatbot** - Intelligent assistant for CRM tasks
- 🔍 **Command Palette** - Quick navigation with ⌘K
- 🏷️ **Tags System** - Color-coded organization
- 📎 **File Attachments** - Drag-and-drop document management
- 🔔 **Notifications** - Real-time alerts and updates
- 🌙 **Dark Mode** - Full dark theme support
- 🎯 **Quick Add** - Floating quick-add button
- ⚙️ **Feature Toggles** - Customize your CRM experience

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Lucide Icons
- **Backend**: Node.js, Express
- **Database**: SQLite (better-sqlite3)
- **Charts**: Recharts

## Getting Started

### Installation

```bash
# Install all dependencies (root + client)
npm run install-all
```

### Running the Application

```bash
# Run both server and client concurrently
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend server (port 5000)
npm run server

# Terminal 2 - Frontend client (port 3000)
npm run client
```

### Access the Application

- Frontend: http://localhost:3003
- Backend API: http://localhost:5000

## 🚀 Deployment

Ready to deploy to production? We've made it easy!

### Quick Deploy

```bash
# Run the automated setup script
./deploy-setup.sh
```

Then follow the **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for step-by-step instructions.

### Deployment Platforms

- **Frontend**: Netlify (FREE tier available)
- **Backend**: Railway (FREE tier available)
- **Total Cost**: $0/month on free tier

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete instructions.**

## Project Structure

```
CRM/
├── server/
│   ├── index.js          # Express server
│   ├── database.js       # SQLite database setup
│   └── mockData.js       # Mock startup data
├── client/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main app component
│   │   └── index.tsx     # Entry point
│   └── public/
└── package.json
```

## 📊 Mock Data

The CRM comes pre-populated with realistic mock data:
- **50 contacts** - Business owners, executives, decision-makers
- **20 companies** - Small businesses across various industries
- **30 deals** - Growth consulting deals ($5K-$50K range)
- **100 activities** - Calls, meetings, emails, tasks
- **6 workflows** - Pre-configured automation rules

Perfect for testing, demonstration, and learning!

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[CODE_OVERVIEW.md](CODE_OVERVIEW.md)** - Technical architecture and code structure
- **[COOL_FEATURES.md](COOL_FEATURES.md)** - Feature showcase and highlights
- **[WORKFLOWS_EXPLAINED.md](WORKFLOWS_EXPLAINED.md)** - Workflow automation guide
- **[ALL_NEW_FEATURES.md](ALL_NEW_FEATURES.md)** - Complete feature documentation

## 🎨 Screenshots & Features

### Dashboard
- Real-time statistics (contacts, companies, deals, pipeline value)
- Interactive charts (deals by stage, revenue trends)
- Recent activities feed

### Workflows
- 6 pre-built automation workflows
- Category filtering (Sales, Marketing, Operations)
- 6 workflow templates to start from
- Statistics dashboard with execution tracking

### Reports
- Sales Performance analysis
- Pipeline Analysis with charts
- Contact Engagement metrics
- Company Overview reports
- PDF/CSV export functionality

### AI Features
- AI-powered analytics and forecasting
- Natural language search
- Email composition assistance
- Deal probability scoring
- Intelligent chatbot assistant

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3003
```

**Frontend (client/.env.local):**
```bash
REACT_APP_API_URL=http://localhost:5000
```

For production, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🛠️ Built With

### Frontend
- React 18 with TypeScript
- TailwindCSS for styling
- React Router for navigation
- Recharts for data visualization
- Lucide React for icons
- date-fns for date handling

### Backend
- Node.js with Express
- SQLite with better-sqlite3
- CORS enabled
- RESTful API architecture

## 📈 What Makes This Special

✅ **Production-Ready** - Deploy to production in 30 minutes
✅ **Enterprise Features** - Workflow automation, AI analytics, custom reports
✅ **Beautiful UI** - Modern design with dark mode
✅ **Fully Functional** - Not a demo - everything works
✅ **Customizable** - Feature toggles, themes, workflows
✅ **Scalable** - Built to grow with your business
✅ **Free to Deploy** - $0/month on free tier
✅ **You Own It** - 100% yours to customize

## 🤝 Contributing

This is a private CRM for your business, but feel free to customize it however you need!

## 📝 License

This project is for your personal/business use. Customize and deploy as needed!

## 🎯 Next Steps

1. **Run locally**: `npm run dev`
2. **Explore features**: Check out all the pages and functionality
3. **Deploy**: Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
4. **Customize**: Add your branding, modify workflows, adjust features
5. **Use it**: Start managing your business with your own CRM!

---

**Built with ❤️ for small business growth**
