import React from 'react';
import { Sparkles } from 'lucide-react';

interface FeatureBadgeProps {
  label: string;
  variant?: 'new' | 'beta' | 'pro';
}

function FeatureBadge({ label, variant = 'new' }: FeatureBadgeProps) {
  const colors = {
    new: 'bg-green-100 text-green-700 border-green-300',
    beta: 'bg-blue-100 text-blue-700 border-blue-300',
    pro: 'bg-purple-100 text-purple-700 border-purple-300'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[variant]}`}>
      <Sparkles className="w-3 h-3 mr-1" />
      {label}
    </span>
  );
}

export default FeatureBadge;
