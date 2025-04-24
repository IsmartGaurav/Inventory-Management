"use client";

import React, { useMemo } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { useTableState } from '@/hooks/useTableState';
import { columns } from './columns';
import { TableHeader } from './table/TableHeader';
import { TableStateHandlers } from './table/TableStateHandlers';
import { MobileTableView } from './table/MobileTableView';
import { DesktopTableView } from './table/DesktopTableView';
import { TablePagination } from './table/TablePagination';
import { RowData } from '@/hooks/useEnhancedSearch';


export function InventoryTable() {
  // Use our optimized inventory hook
  const { processedData, isLoading, error, useMockData, toggleMockData, mutate } = useInventory();

  // Safely memoize data to prevent unnecessary re-renders
  const data = useMemo(() => {
    try {
      if (!processedData || !Array.isArray(processedData)) return [];
      // Cast the data to RowData[] to ensure compatibility with the table
      return processedData as unknown as RowData[];
    } catch (e) {
      console.error('Error accessing data:', e);
      return [];
    }
  }, [processedData]);

  // Use extracted table state management
  const { table, globalFilter, setGlobalFilter, setPagination } = useTableState(data, columns);

  // Function to reset filters when refreshing data
  const resetFilters = () => {
    setGlobalFilter('');
    setPagination({ pageIndex: 0, pageSize: table.getState().pagination.pageSize });
  };

  // Handle state conditions with extracted component
  const stateHandler = (
    <TableStateHandlers
      isLoading={isLoading}
      error={error}
      data={data}
      useMockData={useMockData}
      toggleMockData={toggleMockData}
    />
  );

  // Return early if we're in a special state (loading, error, or empty)
  if (isLoading || error || !data || data.length === 0) {
    return stateHandler;
  }

  // Safely render the fully-featured table with error boundary
  try {
    return (
      <div className="w-full p-4 bg-[#1A1A1A] rounded-lg shadow-lg">
        {/* Header with title and search bar */}
        <TableHeader
          title="Inventory Components"
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          useMockData={useMockData}
          toggleMockData={toggleMockData}
          mutate={mutate}
          resetFilters={resetFilters}
        />

        {/* Enhanced responsive table with full functionality */}
        <div className="overflow-x-auto bg-[#121212] rounded-lg"
             style={{ maxHeight: '70vh' }} // Limit height for large datasets
        >
          {/* Mobile responsive design */}
          <MobileTableView table={table} />

          {/* Desktop table view */}
          <DesktopTableView table={table} />
        </div>

        {/* Pagination controls */}
        <TablePagination table={table} />


      </div>
    );
  } catch (e) {
    console.error('Error rendering table component:', e);
    // Fallback UI if anything fails during rendering
    return (
      <div className="p-6 text-center text-red-400 bg-[#1A1A1A] rounded-lg">
        <p className="text-lg font-medium mb-2">Error rendering table</p>
        <p>There was an error displaying the table. Please try refreshing the page.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Refresh Page
        </button>
      </div>
    );
  }
}
