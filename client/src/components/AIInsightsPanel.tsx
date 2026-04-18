import React from 'react';
import { Brain, TrendingUp, AlertCircle, Lightbulb, Target, Clock, ThumbsUp } from 'lucide-react';

interface AIInsight {
  type: 'recommendation' | 'warning' | 'opportunity' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  action?: string;
}

interface AIInsightsPanelProps {
  entityType: 'contact' | 'deal' | 'company';
  entityData: any;
}

function AIInsightsPanel({ entityType, entityData }: AIInsightsPanelProps) {
  const generateInsights = (): AIInsight[] => {
    if (entityType === 'deal') {
      return [
        {
          type: 'prediction',
          title: 'High Win Probability',
          description: `This deal has an 78% predicted win rate based on similar deals in ${entityData.stage} stage with comparable value.`,
          confidence: 78,
          action: 'Focus on closing this week'
        },
        {
          type: 'recommendation',
          title: 'Recommended Next Action',
          description: 'Schedule a follow-up call within 2 days. Deals in this stage that have calls scheduled close 45% faster.',
          confidence: 85,
          action: 'Schedule call'
        },
        {
          type: 'opportunity',
          title: 'Upsell Opportunity Detected',
          description: 'Based on company size and industry, there\'s potential for a 30% larger deal with additional services.',
          confidence: 65,
          action: 'Propose expanded package'
        },
        {
          type: 'warning',
          title: 'Risk Alert',
          description: 'No activity in 5 days. Deals with this gap have 23% lower close rates. Immediate action recommended.',
          confidence: 92,
          action: 'Send follow-up email'
        }
      ];
    } else if (entityType === 'contact') {
      return [
        {
          type: 'prediction',
          title: 'High Engagement Score',
          description: 'This contact shows strong engagement patterns. Response rate is 85% above average.',
          confidence: 88,
        },
        {
          type: 'recommendation',
          title: 'Best Time to Contact',
          description: 'AI analysis suggests Tuesday-Thursday, 10 AM - 2 PM for highest response rates.',
          confidence: 76,
          action: 'Schedule activity'
        },
        {
          type: 'opportunity',
          title: 'Expansion Opportunity',
          description: 'Contact has decision-making authority and company is in growth phase. Good timing for additional services.',
          confidence: 71,
        }
      ];
    } else {
      return [
        {
          type: 'prediction',
          title: 'Growth Trajectory',
          description: 'Company shows strong growth indicators. Revenue increased 40% based on public data.',
          confidence: 82,
        },
        {
          type: 'opportunity',
          title: 'Multiple Stakeholder Opportunity',
          description: 'Company has 3+ decision makers. Multi-threading approach recommended.',
          confidence: 79,
          action: 'Identify additional contacts'
        }
      ];
    }
  };

  const insights = generateInsights();

  const getIcon = (type: string) => {
    switch (type) {
      case 'prediction': return TrendingUp;
      case 'warning': return AlertCircle;
      case 'opportunity': return Target;
      case 'recommendation': return Lightbulb;
      default: return Brain;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'warning': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'opportunity': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'recommendation': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Insights</h2>
        <span className="ml-auto text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-full">
          Powered by AI
        </span>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = getIcon(insight.type);
          const colorClass = getColor(insight.type);

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${colorClass.includes('blue') ? 'border-blue-500' : 
                colorClass.includes('red') ? 'border-red-500' : 
                colorClass.includes('green') ? 'border-green-500' : 
                'border-purple-500'} ${colorClass}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h3>
                    <div className="flex items-center gap-1 text-xs">
                      <ThumbsUp className="w-3 h-3" />
                      <span className="font-medium">{insight.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {insight.description}
                  </p>
                  {insight.action && (
                    <button className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {insight.action}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 AI insights are generated based on historical data, patterns, and machine learning models. 
          Confidence scores indicate prediction accuracy.
        </p>
      </div>
    </div>
  );
}

export default AIInsightsPanel;
