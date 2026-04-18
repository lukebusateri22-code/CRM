import React, { useState } from 'react';
import { Plus, Users, Building2, DollarSign, Calendar, X } from 'lucide-react';
import QuickAddModal from './QuickAddModal';

function FloatingQuickAdd() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalType, setModalType] = useState<'contact' | 'deal' | 'company' | null>(null);

  const quickActions = [
    { type: 'contact' as const, icon: Users, label: 'Contact', color: 'bg-blue-500' },
    { type: 'company' as const, icon: Building2, label: 'Company', color: 'bg-green-500' },
    { type: 'deal' as const, icon: DollarSign, label: 'Deal', color: 'bg-purple-500' },
  ];

  const handleSave = async (data: any) => {
    const endpoints = {
      contact: '/api/contacts',
      company: '/api/companies',
      deal: '/api/deals'
    };

    try {
      await fetch(endpoints[modalType!], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-24 z-40">
        {isMenuOpen && (
          <div className="mb-4 space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.type}
                onClick={() => {
                  setModalType(action.type);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-3 ${action.color} text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full`}
              >
                <action.icon className="w-5 h-5" />
                <span className="font-medium">Add {action.label}</span>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          aria-label="Quick add"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </button>
      </div>

      {modalType && (
        <QuickAddModal
          type={modalType}
          isOpen={true}
          onClose={() => setModalType(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}

export default FloatingQuickAdd;
