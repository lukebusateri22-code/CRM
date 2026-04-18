import React, { useEffect, useState } from 'react';
import { DollarSign, Calendar, Building2, User, Plus } from 'lucide-react';
import { apiUrl } from '../config';
import { format } from 'date-fns';
import FeatureBadge from '../components/FeatureBadge';

interface Deal {
  id: number;
  title: string;
  value: number;
  stage: string;
  probability: number;
  company_name: string;
  contact_name: string;
  expected_close_date: string;
  description: string;
}

const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

const stageColors: { [key: string]: string } = {
  'Prospecting': 'bg-gray-50 border-gray-200',
  'Qualification': 'bg-blue-50 border-blue-200',
  'Proposal': 'bg-yellow-50 border-yellow-200',
  'Negotiation': 'bg-orange-50 border-orange-200',
  'Closed Won': 'bg-green-50 border-green-200',
  'Closed Lost': 'bg-red-50 border-red-200',
};

function DealsKanban() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    fetch(apiUrl('/api/deals'))
      .then(res => res.json())
      .then(data => {
        setDeals(data);
        setLoading(false);
      });
  }, []);

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stage: string) => {
    if (!draggedDeal) return;

    try {
      const response = await fetch(`/api/deals/${draggedDeal.id}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage })
      });

      if (response.ok) {
        const updatedDeal = await response.json();
        setDeals(deals.map(d => d.id === updatedDeal.id ? { ...d, stage: updatedDeal.stage, probability: updatedDeal.probability } : d));
      }
    } catch (error) {
      console.error('Error updating deal:', error);
    }

    setDraggedDeal(null);
  };

  const getDealsByStage = (stage: string) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getStageValue = (stage: string) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Deals Pipeline</h1>
            <FeatureBadge label="Kanban View" variant="new" />
          </div>
          <p className="mt-2 text-sm text-gray-600">Drag and drop deals to update their stage</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Pipeline</div>
          <div className="text-2xl font-bold text-primary-600">
            ${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stages.map(stage => {
          const stageDeals = getDealsByStage(stage);
          const stageValue = getStageValue(stage);

          return (
            <div
              key={stage}
              className={`rounded-lg border-2 ${stageColors[stage]} min-h-[600px]`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage)}
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">{stage}</h3>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-gray-600">{stageDeals.length} deals</span>
                  <span className="font-medium text-gray-900">${(stageValue / 1000).toFixed(0)}K</span>
                </div>
              </div>

              <div className="p-2 space-y-2">
                {stageDeals.map(deal => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={() => handleDragStart(deal)}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">{deal.title}</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span className="font-semibold text-primary-600">
                            ${deal.value.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{deal.probability}%</span>
                      </div>

                      {deal.company_name && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Building2 className="w-3 h-3 mr-1" />
                          {deal.company_name}
                        </div>
                      )}

                      {deal.contact_name && (
                        <div className="flex items-center text-xs text-gray-600">
                          <User className="w-3 h-3 mr-1" />
                          {deal.contact_name}
                        </div>
                      )}

                      {deal.expected_close_date && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(deal.expected_close_date), 'MMM dd')}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-primary-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${deal.probability}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No deals in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DealsKanban;
