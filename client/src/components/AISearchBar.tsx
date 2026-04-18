import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, Users, Building2, DollarSign } from 'lucide-react';

interface SearchResult {
  type: 'contact' | 'company' | 'deal';
  id: number;
  title: string;
  subtitle: string;
  relevance: number;
}

function AISearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    "Show me all high-value deals closing this month",
    "Find contacts at companies with over 10 employees",
    "Which deals are at risk of being lost?",
    "Show me my most engaged contacts",
    "Find all companies in the restaurant industry",
    "What deals need follow-up this week?"
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);

    // Simulate AI search with natural language processing
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          type: 'deal',
          id: 1,
          title: 'Business Growth Strategy Package - Peak Performance Gym',
          subtitle: 'Value: $35,000 • Stage: Negotiation • 75% probability',
          relevance: 95
        },
        {
          type: 'deal',
          id: 2,
          title: 'Marketing & Brand Development - Sunrise Bakery',
          subtitle: 'Value: $18,500 • Stage: Proposal • 50% probability',
          relevance: 88
        },
        {
          type: 'contact',
          id: 3,
          title: 'Sarah Johnson - CEO at Coastal Coffee Roasters',
          subtitle: 'High engagement • Last contact: 2 days ago',
          relevance: 82
        },
        {
          type: 'company',
          id: 4,
          title: 'Bella Vista Restaurant',
          subtitle: '14 employees • $920,000 revenue • 2 active deals',
          relevance: 76
        }
      ];

      setResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'contact': return Users;
      case 'company': return Building2;
      case 'deal': return DollarSign;
      default: return Search;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'contact': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'company': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'deal': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Sparkles className="h-5 w-5 text-purple-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="Ask AI anything... (e.g., 'Show me deals closing this month')"
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            onClick={() => handleSearch(query)}
            disabled={isSearching || !query}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            {isSearching ? (
              <div className="animate-spin h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full" />
            ) : (
              <Search className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {showSuggestions && !results.length && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            💡 Try asking:
          </p>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(suggestion);
                  handleSearch(suggestion);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          <div className="p-3 border-b dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              AI found {results.length} relevant results
            </p>
          </div>
          <div className="p-2">
            {results.map((result) => {
              const Icon = getIcon(result.type);
              const colorClass = getColor(result.type);

              return (
                <div
                  key={`${result.type}-${result.id}`}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {result.title}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {result.relevance}% match
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {result.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default AISearchBar;
