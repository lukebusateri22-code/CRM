import React, { useState } from 'react';
import { Settings, X, Bell, Calendar, Kanban, MessageSquare, ListTodo, Zap, FileText, Command, Brain, Plus, User, Tag, Paperclip } from 'lucide-react';

interface FeatureToggles {
  notifications: boolean;
  calendar: boolean;
  kanban: boolean;
  aiChatbot: boolean;
  taskBoard: boolean;
  quickAdd: boolean;
  darkMode: boolean;
  workflows: boolean;
  reports: boolean;
  commandPalette: boolean;
  aiAnalytics: boolean;
  contactDetails: boolean;
  tags: boolean;
  fileAttachments: boolean;
}

interface FeatureTogglePanelProps {
  features: FeatureToggles;
  onToggle: (feature: keyof FeatureToggles) => void;
}

function FeatureTogglePanel({ features, onToggle }: FeatureTogglePanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const featureList = [
    { key: 'notifications' as const, label: 'Notifications', icon: Bell, description: 'Real-time notification alerts', category: 'Core' },
    { key: 'calendar' as const, label: 'Calendar View', icon: Calendar, description: 'Activity calendar interface', category: 'Views' },
    { key: 'kanban' as const, label: 'Kanban Board', icon: Kanban, description: 'Visual pipeline management', category: 'Views' },
    { key: 'taskBoard' as const, label: 'Task Board', icon: ListTodo, description: 'Jira-style task management', category: 'Views' },
    { key: 'workflows' as const, label: 'Workflows', icon: Zap, description: 'Automation and workflow rules', category: 'Automation' },
    { key: 'reports' as const, label: 'Reports', icon: FileText, description: 'Analytics and custom reports', category: 'Analytics' },
    { key: 'aiAnalytics' as const, label: 'AI Analytics', icon: Brain, description: 'AI-powered insights and forecasting', category: 'AI' },
    { key: 'aiChatbot' as const, label: 'AI Assistant', icon: MessageSquare, description: 'AI-powered chatbot helper', category: 'AI' },
    { key: 'commandPalette' as const, label: 'Command Palette', icon: Command, description: 'Keyboard shortcuts (⌘K)', category: 'Productivity' },
    { key: 'quickAdd' as const, label: 'Quick Add Button', icon: Plus, description: 'Floating quick-add button', category: 'Productivity' },
    { key: 'contactDetails' as const, label: 'Contact Details', icon: User, description: 'Detailed contact view pages', category: 'Views' },
    { key: 'tags' as const, label: 'Tags System', icon: Tag, description: 'Organize with color-coded tags', category: 'Organization' },
    { key: 'fileAttachments' as const, label: 'File Attachments', icon: Paperclip, description: 'Upload and manage documents', category: 'Organization' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-20 z-40 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all"
        aria-label="Feature settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div className="w-80 bg-white dark:bg-gray-800 h-full shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Feature Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enable or disable features to customize your CRM experience. {featureList.filter(f => features[f.key]).length} of {featureList.length} features enabled.
              </p>

              {['Core', 'Views', 'AI', 'Automation', 'Analytics', 'Productivity', 'Organization'].map(category => {
                const categoryFeatures = featureList.filter(f => f.category === category);
                if (categoryFeatures.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{category}</h3>
                    {categoryFeatures.map((feature) => (
                <div
                  key={feature.key}
                  className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <feature.icon className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{feature.label}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggle(feature.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      features[feature.key]
                        ? 'bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        features[feature.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
                  </div>
                );
              })}

              <div className="pt-4 border-t dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Changes are saved automatically. Refresh the page if features don't update immediately.
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}

export default FeatureTogglePanel;
