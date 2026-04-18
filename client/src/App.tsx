import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, DollarSign, Calendar, Kanban, ListTodo, Brain, Zap, FileText, LogOut, User } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Companies from './pages/Companies';
import Deals from './pages/Deals';
import DealsKanban from './pages/DealsKanban';
import Activities from './pages/Activities';
import CalendarView from './pages/CalendarView';
import ThemeToggle from './components/ThemeToggle';
import NotificationBell from './components/NotificationBell';
import FloatingQuickAdd from './components/FloatingQuickAdd';
import FeatureBadge from './components/FeatureBadge';
import FeatureTogglePanel from './components/FeatureTogglePanel';
import AIChatbot from './components/AIChatbot';
import TaskBoard from './pages/TaskBoard';
import CommandPalette from './components/CommandPalette';
import Workflows from './pages/Workflows';
import Reports from './pages/Reports';
import AIAnalytics from './pages/AIAnalytics';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function Navigation() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = require('./contexts/AuthContext').useAuth();
  
  if (!isAuthenticated) {
    return null;
  }
  
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/contacts', icon: Users, label: 'Contacts' },
    { path: '/companies', icon: Building2, label: 'Companies' },
    { path: '/workflows', icon: Zap, label: 'Workflows' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/deals', icon: DollarSign, label: 'Deals' },
    { path: '/deals/kanban', icon: Kanban, label: 'Pipeline' },
    { path: '/tasks', icon: ListTodo, label: 'Tasks' },
    { path: '/ai-analytics', icon: Brain, label: 'AI Insights' },
    { path: '/activities', icon: Calendar, label: 'Activities' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">GrowthPartner CRM</h1>
              <span className="ml-3 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full font-medium">
                Small Business Growth Consulting
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-2 pt-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'border-primary-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <ThemeToggle />
            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [features, setFeatures] = React.useState({
    notifications: true,
    calendar: true,
    kanban: true,
    aiChatbot: true,
    taskBoard: true,
    quickAdd: true,
    darkMode: true,
    workflows: true,
    reports: true,
    commandPalette: true,
    aiAnalytics: true,
    contactDetails: true,
    tags: true,
    fileAttachments: true
  });

  const handleFeatureToggle = (feature: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <>
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/contacts/:id" element={<ContactDetail />} />
                        <Route path="/companies" element={<Companies />} />
                        <Route path="/deals" element={<Deals />} />
                        <Route path="/deals/kanban" element={<DealsKanban />} />
                        <Route path="/tasks" element={<TaskBoard />} />
                        <Route path="/ai-analytics" element={<AIAnalytics />} />
                        <Route path="/workflows" element={<Workflows />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/activities" element={<Activities />} />
                        <Route path="/calendar" element={<CalendarView />} />
                      </Routes>
                    </main>
                  </>
                </ProtectedRoute>
              } />
            </Routes>
            {features.quickAdd && <FloatingQuickAdd />}
            {features.aiChatbot && <AIChatbot isEnabled={features.aiChatbot} />}
            <FeatureTogglePanel features={features} onToggle={handleFeatureToggle} />
            <CommandPalette />
          </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
