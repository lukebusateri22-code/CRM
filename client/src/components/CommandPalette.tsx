import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Building2, DollarSign, Calendar, Brain, ListTodo, Command } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  category: string;
}

function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const commands: Command[] = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: Users, action: () => navigate('/'), category: 'Navigation' },
    { id: 'contacts', label: 'Go to Contacts', icon: Users, action: () => navigate('/contacts'), category: 'Navigation' },
    { id: 'companies', label: 'Go to Companies', icon: Building2, action: () => navigate('/companies'), category: 'Navigation' },
    { id: 'deals', label: 'Go to Deals', icon: DollarSign, action: () => navigate('/deals'), category: 'Navigation' },
    { id: 'pipeline', label: 'Go to Pipeline (Kanban)', icon: DollarSign, action: () => navigate('/deals/kanban'), category: 'Navigation' },
    { id: 'tasks', label: 'Go to Tasks', icon: ListTodo, action: () => navigate('/tasks'), category: 'Navigation' },
    { id: 'ai-analytics', label: 'Go to AI Insights', icon: Brain, action: () => navigate('/ai-analytics'), category: 'Navigation' },
    { id: 'activities', label: 'Go to Activities', icon: Calendar, action: () => navigate('/activities'), category: 'Navigation' },
    { id: 'calendar', label: 'Go to Calendar', icon: Calendar, action: () => navigate('/calendar'), category: 'Navigation' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCommand = (command: Command) => {
    command.action();
    setIsOpen(false);
    setSearch('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl mx-4">
        <div className="flex items-center gap-3 p-4 border-b dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No commands found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((command) => {
                const Icon = command.icon;
                return (
                  <button
                    key={command.id}
                    onClick={() => handleCommand(command)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {command.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {command.category}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-between">
            <span>Press ESC to close</span>
            <span>⌘K to open</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
