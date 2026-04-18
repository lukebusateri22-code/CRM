import React, { useState } from 'react';
import { Zap, Plus, Play, Pause, Trash2, Edit, Copy, TrendingUp, Clock, CheckCircle, AlertTriangle, Mail, Bell, Tag, Calendar } from 'lucide-react';
import FeatureBadge from '../components/FeatureBadge';
import { useToast } from '../contexts/ToastContext';

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  triggerType: 'deal' | 'contact' | 'activity' | 'time';
  actions: string[];
  enabled: boolean;
  runsCount: number;
  lastRun?: string;
  category: 'sales' | 'marketing' | 'operations';
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'marketing' | 'operations';
  icon: any;
  trigger: string;
  actions: string[];
}

function Workflows() {
  const { showToast } = useToast();
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sales' | 'marketing' | 'operations'>('all');
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Auto-create follow-up task',
      description: 'Automatically create tasks when deals advance to ensure timely follow-ups',
      trigger: 'When deal moves to Negotiation',
      triggerType: 'deal',
      actions: ['Create task: "Send proposal"', 'Assign to deal owner', 'Set due date: +2 days'],
      enabled: true,
      runsCount: 45,
      lastRun: '2 hours ago',
      category: 'sales'
    },
    {
      id: '2',
      name: 'Welcome email sequence',
      description: 'Nurture new contacts with automated welcome emails',
      trigger: 'When contact is created',
      triggerType: 'contact',
      actions: ['Send welcome email', 'Wait 2 days', 'Send follow-up email'],
      enabled: true,
      runsCount: 23,
      lastRun: '1 day ago',
      category: 'marketing'
    },
    {
      id: '3',
      name: 'Deal inactivity alert',
      description: 'Get notified about stale deals to prevent them from going cold',
      trigger: 'When deal has no activity for 7 days',
      triggerType: 'time',
      actions: ['Create notification', 'Send email to deal owner', 'Mark deal as at-risk'],
      enabled: false,
      runsCount: 12,
      lastRun: '3 days ago',
      category: 'operations'
    },
    {
      id: '4',
      name: 'Lead scoring automation',
      description: 'Automatically score leads based on engagement to prioritize hot prospects',
      trigger: 'When contact email is opened',
      triggerType: 'activity',
      actions: ['Increase engagement score by 10', 'Add tag: "engaged"'],
      enabled: true,
      runsCount: 156,
      lastRun: '30 minutes ago',
      category: 'marketing'
    },
    {
      id: '5',
      name: 'High-value deal notification',
      description: 'Get instant alerts when high-value deals are created',
      trigger: 'When deal value exceeds $50,000',
      triggerType: 'deal',
      actions: ['Send notification to team', 'Add tag: "high-value"', 'Assign to senior rep'],
      enabled: true,
      runsCount: 8,
      lastRun: '5 days ago',
      category: 'sales'
    },
    {
      id: '6',
      name: 'Monthly report automation',
      description: 'Automatically generate and send monthly performance reports',
      trigger: 'On the 1st of each month',
      triggerType: 'time',
      actions: ['Generate sales report', 'Email to team', 'Create summary dashboard'],
      enabled: true,
      runsCount: 3,
      lastRun: '15 days ago',
      category: 'operations'
    }
  ]);

  const templates: WorkflowTemplate[] = [
    {
      id: 't1',
      name: 'Deal Stage Automation',
      description: 'Auto-create tasks when deals move between stages',
      category: 'sales',
      icon: Zap,
      trigger: 'When deal stage changes',
      actions: ['Create task based on stage', 'Notify deal owner', 'Update timeline']
    },
    {
      id: 't2',
      name: 'Email Engagement Tracking',
      description: 'Track email opens and clicks automatically',
      category: 'marketing',
      icon: Mail,
      trigger: 'When email is opened or clicked',
      actions: ['Log activity', 'Update engagement score', 'Trigger follow-up']
    },
    {
      id: 't3',
      name: 'Overdue Task Reminders',
      description: 'Send reminders for overdue tasks',
      category: 'operations',
      icon: Bell,
      trigger: 'When task is overdue',
      actions: ['Send notification', 'Email task owner', 'Escalate if needed']
    },
    {
      id: 't4',
      name: 'Contact Birthday Greetings',
      description: 'Send automated birthday wishes to contacts',
      category: 'marketing',
      icon: Calendar,
      trigger: 'On contact birthday',
      actions: ['Send birthday email', 'Create reminder for call', 'Log activity']
    },
    {
      id: 't5',
      name: 'Deal Won Celebration',
      description: 'Celebrate wins and update team',
      category: 'sales',
      icon: CheckCircle,
      trigger: 'When deal is marked as Won',
      actions: ['Send team notification', 'Update revenue dashboard', 'Create thank you task']
    },
    {
      id: 't6',
      name: 'Auto-Tag by Industry',
      description: 'Automatically tag contacts based on company industry',
      category: 'operations',
      icon: Tag,
      trigger: 'When contact is created',
      actions: ['Detect industry', 'Add industry tag', 'Assign to specialist']
    }
  ];

  const toggleWorkflow = (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    setWorkflows(workflows.map(w => 
      w.id === id ? { ...w, enabled: !w.enabled } : w
    ));
    showToast('success', `Workflow "${workflow?.name}" ${workflow?.enabled ? 'paused' : 'activated'}`);
  };

  const duplicateWorkflow = (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (workflow) {
      const newWorkflow = {
        ...workflow,
        id: Date.now().toString(),
        name: `${workflow.name} (Copy)`,
        enabled: false,
        runsCount: 0
      };
      setWorkflows([...workflows, newWorkflow]);
      showToast('success', 'Workflow duplicated successfully');
    }
  };

  const deleteWorkflow = (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    setWorkflows(workflows.filter(w => w.id !== id));
    showToast('success', `Workflow "${workflow?.name}" deleted`);
  };

  const createFromTemplate = (template: WorkflowTemplate) => {
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: template.name,
      description: template.description,
      trigger: template.trigger,
      triggerType: 'deal',
      actions: template.actions,
      enabled: false,
      runsCount: 0,
      category: template.category
    };
    setWorkflows([...workflows, newWorkflow]);
    setShowTemplates(false);
    showToast('success', `Workflow created from template: ${template.name}`);
  };

  const filteredWorkflows = selectedCategory === 'all' 
    ? workflows 
    : workflows.filter(w => w.category === selectedCategory);

  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.enabled).length,
    totalRuns: workflows.reduce((sum, w) => sum + w.runsCount, 0),
    categories: {
      sales: workflows.filter(w => w.category === 'sales').length,
      marketing: workflows.filter(w => w.category === 'marketing').length,
      operations: workflows.filter(w => w.category === 'operations').length
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sales': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'marketing': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400';
      case 'operations': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workflow Automation</h1>
          <FeatureBadge label="Automation" variant="pro" />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowTemplates(true)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Templates
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Workflow
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Workflows</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Workflows</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRuns}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Executions</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(stats.totalRuns / stats.total)}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Runs/Workflow</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setSelectedCategory('sales')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'sales'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Sales ({stats.categories.sales})
        </button>
        <button
          onClick={() => setSelectedCategory('marketing')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'marketing'
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Marketing ({stats.categories.marketing})
        </button>
        <button
          onClick={() => setSelectedCategory('operations')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'operations'
              ? 'bg-green-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Operations ({stats.categories.operations})
        </button>
      </div>

      {/* Workflows List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredWorkflows.map(workflow => (
          <div
            key={workflow.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${
              workflow.enabled ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <Zap className={`w-6 h-6 mt-1 ${workflow.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {workflow.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(workflow.category)}`}>
                      {workflow.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{workflow.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span className="font-medium">Trigger:</span> {workflow.trigger}
                    </span>
                    {workflow.lastRun && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last run: {workflow.lastRun}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Actions:</p>
                    {workflow.actions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWorkflow(workflow.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    workflow.enabled
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={workflow.enabled ? 'Pause' : 'Enable'}
                >
                  {workflow.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => duplicateWorkflow(workflow.id)}
                  className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteWorkflow(workflow.id)}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
              <div className="flex items-center gap-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  workflow.enabled
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {workflow.enabled ? '● Active' : '○ Paused'}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Executed <span className="font-semibold">{workflow.runsCount}</span> times
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workflow Templates</h2>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Plus className="w-5 h-5 rotate-45 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.id}
                    className="border dark:border-gray-700 rounded-lg p-4 hover:border-primary-500 transition-colors cursor-pointer"
                    onClick={() => createFromTemplate(template)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Icon className="w-6 h-6 text-primary-600" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{template.description}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                          {template.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span className="font-medium">Trigger:</span> {template.trigger}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{template.actions.length} actions</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <Zap className="w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold mb-2">How Workflow Automation Works</h3>
            <p className="text-purple-100 mb-4">
              Workflows automatically perform actions when specific events happen in your CRM. Set them up once, and they'll run 24/7, 
              saving you hours of manual work and ensuring nothing falls through the cracks.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-semibold">Triggers</div>
                <div className="text-purple-200 text-xs">Events that start workflows</div>
              </div>
              <div>
                <div className="font-semibold">Actions</div>
                <div className="text-purple-200 text-xs">What happens automatically</div>
              </div>
              <div>
                <div className="font-semibold">Categories</div>
                <div className="text-purple-200 text-xs">Sales, Marketing, Operations</div>
              </div>
              <div>
                <div className="font-semibold">Templates</div>
                <div className="text-purple-200 text-xs">Pre-built workflows to start</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workflows;
