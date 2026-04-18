import React, { useEffect, useState } from 'react';
import { DollarSign, Building2, User, Calendar } from 'lucide-react';
import { apiUrl } from '../config';
import { format } from 'date-fns';

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

const stageColors: { [key: string]: string } = {
  'Prospecting': 'bg-gray-100 text-gray-800',
  'Qualification': 'bg-blue-100 text-blue-800',
  'Proposal': 'bg-yellow-100 text-yellow-800',
  'Negotiation': 'bg-orange-100 text-orange-800',
  'Closed Won': 'bg-green-100 text-green-800',
  'Closed Lost': 'bg-red-100 text-red-800',
};

function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState('All');

  useEffect(() => {
    fetch(apiUrl('/api/deals'))
      .then(res => res.json())
      .then(data => {
        setDeals(data);
        setLoading(false);
      });
  }, []);

  const stages = ['All', 'Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const filteredDeals = filterStage === 'All' 
    ? deals 
    : deals.filter(deal => deal.stage === filterStage);

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="mt-2 text-sm text-gray-600">Monitor your sales pipeline</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Pipeline Value</div>
          <div className="text-2xl font-bold text-primary-600">${totalValue.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {stages.map(stage => (
            <button
              key={stage}
              onClick={() => setFilterStage(stage)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filterStage === stage
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDeals.map((deal) => (
          <div key={deal.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{deal.title}</h3>
                <p className="text-sm text-gray-500">{deal.description}</p>
              </div>
              <span className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${stageColors[deal.stage]}`}>
                {deal.stage}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-semibold text-lg text-gray-900">${deal.value.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {deal.probability}% probability
                </div>
              </div>

              {deal.company_name && (
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                  {deal.company_name}
                </div>
              )}

              {deal.contact_name && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  {deal.contact_name}
                </div>
              )}

              {deal.expected_close_date && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Expected close: {format(new Date(deal.expected_close_date), 'MMM dd, yyyy')}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${deal.probability}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-500 text-center">
        Showing {filteredDeals.length} of {deals.length} deals
      </div>
    </div>
  );
}

export default Deals;
