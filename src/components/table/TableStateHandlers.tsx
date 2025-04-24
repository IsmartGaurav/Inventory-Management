"use client";

import { RowData } from '@/hooks/useEnhancedSearch';

interface TableStateProps {
  isLoading: boolean;
  error: Error | null;
  data: RowData[];
  useMockData: boolean;
  toggleMockData: (useMock?: boolean) => Promise<void>;
}

/**
 * Component to handle different table states (loading, error, empty)
 */
export function TableStateHandlers({
  isLoading,
  error,
  data,
  useMockData,
  toggleMockData
}: TableStateProps) {
  // Handle loading state with improved UI
  if (isLoading) {
    return (
      <div className="w-full p-6 text-center bg-[#1A1A1A] rounded-lg shadow-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin mr-2 h-6 w-6 border-t-2 border-blue-500 rounded-full"></div>
          <span className="text-white font-medium">Loading inventory data...</span>
        </div>
      </div>
    );
  }

  // Handle error state with improved UX
  if (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? String(error.message)
      : 'Unknown error';
    return (
      <div className="w-full p-6 text-center bg-[#1A1A1A] rounded-lg shadow-lg">
        <div className="text-red-400 mb-3">
          <span className="font-medium">Error loading inventory data:</span> {errorMessage}
        </div>
        <button
          onClick={() => toggleMockData(true)}
          className="bg-amber-600 px-4 py-2 rounded text-white font-medium"
        >
          Load Mock Data Instead
        </button>
      </div>
    );
  }

  // Empty state with option to load mock data
  if (!data || data.length === 0) {
    return (
      <div className="w-full p-6 text-center bg-[#1A1A1A] rounded-lg shadow-lg">
        <div className="text-yellow-400 mb-3 font-medium">No inventory data available</div>
        {!useMockData && (
          <button
            onClick={() => toggleMockData(true)}
            className="bg-amber-600 px-4 py-2 rounded text-white font-medium"
          >
            Load Mock Data
          </button>
        )}
      </div>
    );
  }

  // Return null if we have data (main table will render)
  return null;
}
