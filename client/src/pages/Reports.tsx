import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, DollarSign, Users, Building2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import FeatureBadge from '../components/FeatureBadge';

function Reports() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [reportType, setReportType] = useState('sales-performance');

  const salesData = [
    { month: 'Jan', revenue: 45000, deals: 12 },
    { month: 'Feb', revenue: 52000, deals: 15 },
    { month: 'Mar', revenue: 48000, deals: 13 },
    { month: 'Apr', revenue: 61000, deals: 18 },
  ];

  const pipelineData = [
    { name: 'Prospecting', value: 8, color: '#6b7280' },
    { name: 'Qualification', value: 6, color: '#3b82f6' },
    { name: 'Proposal', value: 5, color: '#f59e0b' },
    { name: 'Negotiation', value: 4, color: '#8b5cf6' },
    { name: 'Closed Won', value: 7, color: '#10b981' },
  ];

  const reports = [
    {
      id: 'sales-performance',
      name: 'Sales Performance',
      description: 'Revenue and deals closed over time',
      icon: TrendingUp,
      metrics: { revenue: '$206K', deals: 58, avgDeal: '$3.6K' }
    },
    {
      id: 'pipeline-analysis',
      name: 'Pipeline Analysis',
      description: 'Deals distribution across stages',
      icon: DollarSign,
      metrics: { totalDeals: 30, pipelineValue: '$450K', avgProbability: '65%' }
    },
    {
      id: 'contact-engagement',
      name: 'Contact Engagement',
      description: 'Contact activity and response rates',
      icon: Users,
      metrics: { activeContacts: 42, engagementRate: '78%', avgResponse: '2.3 days' }
    },
    {
      id: 'company-overview',
      name: 'Company Overview',
      description: 'Company metrics and industry breakdown',
      icon: Building2,
      metrics: { totalCompanies: 20, avgRevenue: '$520K', topIndustry: 'Restaurant' }
    },
  ];

  const exportReport = (format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exporting report as ${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <FeatureBadge label="Reports" variant="pro" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportReport('pdf')}
            className="px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={() => exportReport('csv')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map(report => {
          const Icon = report.icon;
          return (
            <button
              key={report.id}
              onClick={() => setReportType(report.id)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                reportType === report.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300'
              }`}
            >
              <Icon className={`w-8 h-8 mb-3 ${reportType === report.id ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400'}`} />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{report.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{report.description}</p>
              <div className="space-y-1">
                {Object.entries(report.metrics).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {reports.find(r => r.id === reportType)?.name}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="last-7-days">Last 7 days</option>
                <option value="last-30-days">Last 30 days</option>
                <option value="last-90-days">Last 90 days</option>
                <option value="this-year">This year</option>
                <option value="custom">Custom range</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reportType === 'sales-performance' && (
            <>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Deals Closed</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="deals" fill="#10b981" name="Deals" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {reportType === 'pipeline-analysis' && (
            <>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Pipeline Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pipelineData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pipelineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center">
                <div className="space-y-4 w-full">
                  {pipelineData.map(stage => (
                    <div key={stage.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{stage.name}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{stage.value} deals</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${(stage.value / 30) * 100}%`, backgroundColor: stage.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 pt-6 border-t dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">$206,000</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">+18% vs last period</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-400 mb-1">Deals Closed</div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">58</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">+23% vs last period</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Win Rate</div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">78%</div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">+5% vs last period</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
