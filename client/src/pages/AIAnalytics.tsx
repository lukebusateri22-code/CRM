import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Zap, DollarSign, Users, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import FeatureBadge from '../components/FeatureBadge';

function AIAnalytics() {
  const revenueForecast = [
    { month: 'Jan', actual: 45000, predicted: 47000 },
    { month: 'Feb', actual: 52000, predicted: 54000 },
    { month: 'Mar', actual: 48000, predicted: 49000 },
    { month: 'Apr', actual: 61000, predicted: 63000 },
    { month: 'May', predicted: 68000 },
    { month: 'Jun', predicted: 72000 },
    { month: 'Jul', predicted: 78000 },
  ];

  const dealRiskAnalysis = [
    { name: 'Low Risk', value: 12, color: '#10b981' },
    { name: 'Medium Risk', value: 8, color: '#f59e0b' },
    { name: 'High Risk', value: 5, color: '#ef4444' },
    { name: 'Critical', value: 2, color: '#dc2626' },
  ];

  const opportunityScore = [
    { category: 'Upsell', score: 85 },
    { category: 'Cross-sell', score: 72 },
    { category: 'Renewal', score: 91 },
    { category: 'New Business', score: 68 },
  ];

  const aiPredictions = [
    {
      icon: TrendingUp,
      title: 'Revenue Forecast',
      prediction: '$78,000 by July',
      confidence: 87,
      trend: '+23% vs last quarter',
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: AlertTriangle,
      title: 'Churn Risk',
      prediction: '3 accounts at risk',
      confidence: 92,
      trend: 'Immediate action needed',
      color: 'text-red-600 bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: Target,
      title: 'Win Probability',
      prediction: '78% average close rate',
      confidence: 85,
      trend: '+12% improvement',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Zap,
      title: 'Best Opportunities',
      prediction: '5 high-value deals',
      confidence: 81,
      trend: 'Total value: $145K',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
    },
  ];

  const insights = [
    {
      title: 'Peak Conversion Time',
      description: 'Deals contacted on Tuesday-Thursday have 34% higher close rates',
      action: 'Schedule key activities mid-week'
    },
    {
      title: 'Optimal Deal Size',
      description: 'Deals between $15K-$35K have the highest win rate (82%)',
      action: 'Focus on this sweet spot'
    },
    {
      title: 'Follow-up Impact',
      description: 'Deals with 3+ touchpoints in first week close 45% faster',
      action: 'Increase early engagement'
    },
    {
      title: 'Industry Trends',
      description: 'Restaurant & Fitness sectors showing 40% growth this quarter',
      action: 'Prioritize these industries'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Analytics & Forecasting</h1>
          <FeatureBadge label="AI-Powered" variant="pro" />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Brain className="w-4 h-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiPredictions.map((prediction, index) => (
          <div key={index} className={`p-6 rounded-lg ${prediction.color}`}>
            <div className="flex items-center justify-between mb-4">
              <prediction.icon className="w-8 h-8" />
              <span className="text-xs font-medium">{prediction.confidence}% confidence</span>
            </div>
            <h3 className="text-sm font-medium mb-1">{prediction.title}</h3>
            <p className="text-2xl font-bold mb-2">{prediction.prediction}</p>
            <p className="text-xs opacity-75">{prediction.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Revenue Forecast (AI Prediction)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueForecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} name="Actual" />
              <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" name="AI Forecast" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            📈 AI predicts 23% revenue growth over next 3 months based on pipeline analysis and historical patterns
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Deal Risk Analysis
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dealRiskAnalysis}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dealRiskAnalysis.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            ⚠️ AI identified 7 deals requiring immediate attention to prevent loss
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Opportunity Scoring
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={opportunityScore}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI-Generated Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{insight.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{insight.description}</p>
              <button className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {insight.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <Brain className="w-12 h-12 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-2">How AI Analytics Works</h3>
            <p className="text-purple-100 mb-4">
              Our AI engine analyzes thousands of data points including deal history, engagement patterns, 
              industry trends, and seasonal variations to provide accurate predictions and actionable insights.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <DollarSign className="w-5 h-5 mb-1" />
                <div className="font-medium">Revenue ML</div>
                <div className="text-purple-200 text-xs">Forecasting models</div>
              </div>
              <div>
                <Users className="w-5 h-5 mb-1" />
                <div className="font-medium">Behavior Analysis</div>
                <div className="text-purple-200 text-xs">Pattern recognition</div>
              </div>
              <div>
                <Target className="w-5 h-5 mb-1" />
                <div className="font-medium">Risk Scoring</div>
                <div className="text-purple-200 text-xs">Predictive alerts</div>
              </div>
              <div>
                <Calendar className="w-5 h-5 mb-1" />
                <div className="font-medium">Timing Optimization</div>
                <div className="text-purple-200 text-xs">Best action times</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAnalytics;
