import React, { useEffect, useState } from 'react';
import { Plus, Phone, Mail, Calendar as CalendarIcon, CheckSquare, Search, Filter, Clock, CheckCircle2 } from 'lucide-react';
import { apiUrl } from '../config';
import { format } from 'date-fns';

interface Activity {
  id: number;
  type: string;
  subject: string;
  description: string;
  contact_name: string;
  company_name: string;
  deal_title: string;
  completed: number;
  due_date: string;
  created_at: string;
}

const activityIcons: { [key: string]: any } = {
  'Call': Phone,
  'Email': Mail,
  'Meeting': Calendar,
  'Task': CheckCircle,
  'Note': FileText,
};

const activityColors: { [key: string]: string } = {
  'Call': 'bg-blue-100 text-blue-600',
  'Email': 'bg-purple-100 text-purple-600',
  'Meeting': 'bg-green-100 text-green-600',
  'Task': 'bg-yellow-100 text-yellow-600',
  'Note': 'bg-gray-100 text-gray-600',
};

function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetch(apiUrl('/api/activities'))
      .then(res => res.json())
      .then(data => {
        setActivities(data);
        setLoading(false);
      });
  }, []);

  const types = ['All', 'Call', 'Email', 'Meeting', 'Task', 'Note'];
  
  const filteredActivities = activities.filter(activity => {
    const typeMatch = filterType === 'All' || activity.type === filterType;
    const statusMatch = filterStatus === 'All' || 
      (filterStatus === 'Completed' && activity.completed === 1) ||
      (filterStatus === 'Pending' && activity.completed === 0);
    return typeMatch && statusMatch;
  });

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
          <p className="mt-2 text-sm text-gray-600">Track calls, meetings, and tasks</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-2">
              {['All', 'Completed', 'Pending'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {filteredActivities.map((activity) => {
          const Icon = activityIcons[activity.type] || FileText;
          const isOverdue = new Date(activity.due_date) < new Date() && !activity.completed;
          
          return (
            <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 p-3 rounded-lg ${activityColors[activity.type] || 'bg-gray-100 text-gray-600'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{activity.subject}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.completed 
                            ? 'bg-green-100 text-green-800' 
                            : isOverdue
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.completed ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                      
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        {activity.contact_name && (
                          <span>👤 {activity.contact_name}</span>
                        )}
                        {activity.company_name && (
                          <span>🏢 {activity.company_name}</span>
                        )}
                        {activity.deal_title && (
                          <span>💰 {activity.deal_title}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-shrink-0 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {format(new Date(activity.due_date), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(activity.due_date), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No activities found matching your filters.</p>
        </div>
      )}

      <div className="text-sm text-gray-500 text-center">
        Showing {filteredActivities.length} of {activities.length} activities
      </div>
    </div>
  );
}

export default Activities;
