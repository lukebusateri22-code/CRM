import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import FeatureBadge from '../components/FeatureBadge';

interface Activity {
  id: number;
  type: string;
  subject: string;
  due_date: string;
  completed: boolean;
  contact_name: string;
  company_name: string;
}

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => setActivities(data));
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getActivitiesForDate = (date: Date) => {
    return activities.filter(activity => 
      activity.due_date && isSameDay(new Date(activity.due_date), date)
    );
  };

  const activityTypeColors: { [key: string]: string } = {
    'Call': 'bg-blue-500',
    'Email': 'bg-green-500',
    'Meeting': 'bg-purple-500',
    'Task': 'bg-orange-500',
    'Note': 'bg-gray-500',
  };

  const todayActivities = activities.filter(a => 
    a.due_date && isSameDay(new Date(a.due_date), new Date())
  );

  const upcomingActivities = activities.filter(a => {
    if (!a.due_date) return false;
    const dueDate = new Date(a.due_date);
    const today = new Date();
    return dueDate > today && dueDate <= addMonths(today, 1);
  }).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Calendar</h1>
          <FeatureBadge label="Calendar View" variant="new" />
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2 text-sm">
                {day}
              </div>
            ))}

            {calendarDays.map((day, idx) => {
              const dayActivities = getActivitiesForDate(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-24 p-2 border dark:border-gray-700 rounded-lg cursor-pointer transition-colors ${
                    isToday ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayActivities.slice(0, 3).map(activity => (
                      <div
                        key={activity.id}
                        className={`text-xs px-2 py-1 rounded text-white truncate ${activityTypeColors[activity.type] || 'bg-gray-500'}`}
                        title={activity.subject}
                      >
                        {activity.subject}
                      </div>
                    ))}
                    {dayActivities.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                        +{dayActivities.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Today's Activities
            </h3>
            {todayActivities.length > 0 ? (
              <div className="space-y-3">
                {todayActivities.map(activity => (
                  <div key={activity.id} className="border-l-4 border-primary-500 pl-3 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${activityTypeColors[activity.type]}`}></span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{activity.subject}</span>
                    </div>
                    {activity.company_name && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">{activity.company_name}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No activities scheduled for today</p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming</h3>
            {upcomingActivities.length > 0 ? (
              <div className="space-y-3">
                {upcomingActivities.map(activity => (
                  <div key={activity.id} className="pb-3 border-b dark:border-gray-700 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${activityTypeColors[activity.type]}`}></span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{activity.subject}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {format(new Date(activity.due_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
