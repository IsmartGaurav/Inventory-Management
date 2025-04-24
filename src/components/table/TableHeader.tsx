"use client";

import { Search, RefreshCw } from 'lucide-react';

interface TableHeaderProps {
  title: string;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  useMockData: boolean;
  toggleMockData: (useMock?: boolean) => Promise<void>;
  mutate: () => void;
  resetFilters: () => void;
}

/**
 * Table header component with title, search, and control buttons
 */
export function TableHeader({ 
  title, 
  globalFilter, 
  setGlobalFilter, 
  useMockData, 
  toggleMockData, 
  mutate,
  resetFilters
}: TableHeaderProps) {
  return (
    <div className="bg-black p-4 rounded-t-lg border-b border-gray-800">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-xl font-bold text-white">{title}</h1>
      
        {/* Search and controls - responsive layout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Global search input with icon */}
          <div className="relative w-full sm:w-auto mb-2 sm:mb-0">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={globalFilter || ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="w-full sm:w-64 bg-[#232323] pl-8 pr-3 py-2 rounded text-white"
            />
          </div>
          
          <div className="flex gap-2">
            {/* Data source toggle button */}
            <button
              onClick={() => toggleMockData()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded"
              title={useMockData ? 'Currently using mock data' : 'Currently using API data'}
            >
              {useMockData ? 'Mock Data' : 'API Data'}
            </button>
              
            {/* Refresh button with improved functionality */}
            <button
              onClick={() => {
                // Call mutate to refresh data from API
                mutate();
                // Reset filters and pagination
                resetFilters();
                // Provide visual feedback
                const btn = document.activeElement as HTMLButtonElement;
                if (btn) {
                  const originalClass = btn.className;
                  btn.className += ' animate-spin';
                  setTimeout(() => {
                    btn.className = originalClass;
                  }, 750);
                }
              }}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center"
              title="Refresh data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
