import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Building2, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalContacts: number;
  totalCompanies: number;
  totalDeals: number;
  totalRevenue: number;
  pipelineValue: number;
  activitiesThisMonth: number;
}

interface DealsByStage {
  stage: string;
  count: number;
  total_value: number;
}

interface RecentActivity {
  id: number;
  type: string;
  subject: string;
  first_name: string;
  last_name: string;
  company_name: string;
  created_at: string;
}

const COLORS = ['#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#84cc16', '#eab308'];

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dealsByStage, setDealsByStage] = useState<DealsByStage[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard/stats').then(res => res.json()),
      fetch('/api/dashboard/deals-by-stage').then(res => res.json()),
      fetch('/api/dashboard/recent-activities').then(res => res.json()),
    ]).then(([statsData, dealsData, activitiesData]) => {
      setStats(statsData);
      setDealsByStage(dealsData);
      setRecentActivities(activitiesData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const statCards = [
    { label: 'Total Contacts', value: stats?.totalContacts || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Companies', value: stats?.totalCompanies || 0, icon: Building2, color: 'bg-cyan-500' },
    { label: 'Total Deals', value: stats?.totalDeals || 0, icon: DollarSign, color: 'bg-teal-500' },
    { label: 'Pipeline Value', value: `$${((stats?.pipelineValue || 0) / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deals by Stage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dealsByStage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ stage, count }) => `${stage}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {dealsByStage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Value by Stage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dealsByStage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Bar dataKey="total_value" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.subject}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.first_name} {activity.last_name} • {activity.company_name}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {activity.type}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
