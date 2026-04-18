import React, { useEffect, useState } from 'react';
import { Plus, Calendar, User, Flag, MoreVertical } from 'lucide-react';
import FeatureBadge from '../components/FeatureBadge';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  due_date: string;
  labels: string[];
  created_at: string;
}

const statuses = ['To Do', 'In Progress', 'In Review', 'Done'];

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
};

const statusColors = {
  'To Do': 'bg-gray-100 dark:bg-gray-700 border-gray-300',
  'In Progress': 'bg-blue-50 dark:bg-blue-900/20 border-blue-300',
  'In Review': 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300',
  'Done': 'bg-green-50 dark:bg-green-900/20 border-green-300'
};

function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  useEffect(() => {
    // Mock tasks data
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Update CRM dashboard analytics',
        description: 'Add new revenue metrics and charts',
        status: 'In Progress',
        priority: 'high',
        assignee: 'John Doe',
        due_date: '2026-04-20',
        labels: ['frontend', 'analytics'],
        created_at: '2026-04-10'
      },
      {
        id: 2,
        title: 'Fix contact import bug',
        description: 'CSV import failing for large files',
        status: 'To Do',
        priority: 'urgent',
        assignee: 'Sarah Smith',
        due_date: '2026-04-15',
        labels: ['bug', 'backend'],
        created_at: '2026-04-12'
      },
      {
        id: 3,
        title: 'Design new email templates',
        description: 'Create responsive email templates for campaigns',
        status: 'In Review',
        priority: 'medium',
        assignee: 'Mike Johnson',
        due_date: '2026-04-18',
        labels: ['design', 'email'],
        created_at: '2026-04-08'
      },
      {
        id: 4,
        title: 'Database optimization',
        description: 'Optimize queries for better performance',
        status: 'Done',
        priority: 'medium',
        assignee: 'John Doe',
        due_date: '2026-04-12',
        labels: ['backend', 'performance'],
        created_at: '2026-04-05'
      },
      {
        id: 5,
        title: 'Add dark mode to mobile app',
        description: 'Implement dark theme for iOS and Android',
        status: 'To Do',
        priority: 'low',
        assignee: 'Sarah Smith',
        due_date: '2026-04-25',
        labels: ['mobile', 'ui'],
        created_at: '2026-04-11'
      },
      {
        id: 6,
        title: 'User authentication refactor',
        description: 'Migrate to OAuth 2.0',
        status: 'In Progress',
        priority: 'high',
        assignee: 'Mike Johnson',
        due_date: '2026-04-22',
        labels: ['backend', 'security'],
        created_at: '2026-04-09'
      }
    ];
    setTasks(mockTasks);
  }, []);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (!draggedTask) return;
    
    setTasks(tasks.map(task => 
      task.id === draggedTask.id ? { ...task, status } : task
    ));
    setDraggedTask(null);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Board</h1>
          <FeatureBadge label="Jira-Style" variant="new" />
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map(status => {
          const statusTasks = getTasksByStatus(status);
          
          return (
            <div
              key={status}
              className={`rounded-lg border-2 ${statusColors[status as keyof typeof statusColors]} min-h-[600px] p-4`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status)}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">{status}</h2>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                  {statusTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {statusTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm flex-1">
                        {task.title}
                      </h3>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}></span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                        {task.priority}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {task.labels.map(label => (
                        <span
                          key={label}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs"
                        >
                          {label}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{task.assignee}</span>
                      </div>
                      {task.due_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TaskBoard;
