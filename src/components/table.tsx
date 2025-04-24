"use client";

import React, { useState, useMemo } from 'react';
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Search, RefreshCw } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { columns } from './columns';

// Define interface for subcomponent structure
interface Subcomponent {
  component_id: string;
  component_name: string;
  usable_quantity?: number;
  damaged_quantity?: number;
  discarded_quantity?: number;
  total_quantity?: number;
}


export function InventoryTable() {
  // Table state with optimization for performance
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  
  // Use our optimized inventory hook
  const { processedData, isLoading, error, useMockData, toggleMockData, mutate } = useInventory();
  
  // Safely memoize data to prevent unnecessary re-renders
  const data = useMemo(() => {
    try {
      if (!processedData || !Array.isArray(processedData)) return [];
      return processedData;
    } catch (e) {
      console.error('Error accessing data:', e);
      return [];
    }
  }, [processedData]);
  
  // Create TanStack Table instance with all features enabled
  const table = useReactTable({
    data, // Use data directly from the hook
    columns,
    state: { 
      sorting, 
      columnFilters, 
      globalFilter,
      pagination
    },
    enableFilters: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    debugTable: true,
  });

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

  // Safely render the fully-featured table with error boundary
  try {
    return (
      <div className="w-full p-4 bg-[#1A1A1A] rounded-lg shadow-lg">
        {/* Header with title and search bar */}
        <div className="bg-black p-4 rounded-t-lg border-b border-gray-800">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h1 className="text-xl font-bold text-white">Inventory Components</h1>
          
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
                  
                {/* Refresh button */}
                <button
                  onClick={() => mutate()}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center"
                  title="Refresh data"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced responsive table with full functionality */}
        <div className="overflow-x-auto bg-[#121212] rounded-lg"
             style={{ maxHeight: '70vh' }} // Limit height for large datasets
        >
          {/* Mobile responsive design with filtered data */}
          <div className="block md:hidden">
            {table.getRowModel().rows.map(row => {
              const parent = row.original;
              // Skip empty parent components
              if (!parent.component_name) return null;
              
              // Get unique subcomponents (remove duplicates)
              const subcomponents = parent.subcomponents || [];
              const uniqueSubcomponents = subcomponents.reduce((acc: Subcomponent[], curr: Subcomponent) => {
                const exists = acc.find(item => item.component_id === curr.component_id);
                if (!exists) acc.push(curr);
                return acc;
              }, [] as Subcomponent[]);
              
              return (
                <div key={row.id} className="mb-4 border border-gray-800 rounded-md">
                  {/* Parent component header */}
                  <div className="bg-[#1E1E1E] p-3 font-bold text-white rounded-t-md">
                    {parent.component_name}
                  </div>
                  
                  {/* Subcomponents with values */}
                  <div className="bg-black rounded-b-md">
                    {uniqueSubcomponents.length > 0 ? (
                      uniqueSubcomponents.map((subItem: Subcomponent, subIndex: number) => (
                        <div key={`${parent.component_id}-${subItem.component_id}-${subIndex}`} 
                             className="border-t border-gray-800 p-3">
                          {/* Subcomponent name */}
                          <div className="text-white mb-2 font-medium">
                            {subItem.component_name}
                          </div>
                          
                          {/* Values in 2x2 grid for better visibility */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Available:</span>
                              <span className="text-green-400 font-medium">{subItem.usable_quantity || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Replaced:</span>
                              <span className="text-white font-medium">{subItem.damaged_quantity || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Damaged:</span>
                              <span className="text-white font-medium">{subItem.discarded_quantity || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total:</span>
                              <span className="text-white font-medium">{subItem.total_quantity || 0}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 italic text-sm">
                        No subcomponents found
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Desktop table view */}
          <div className="hidden md:block">
          
          <table className="w-full divide-y divide-gray-800">
            {/* Fixed headers for grouped view */}
            <thead className="bg-[#1E1E1E] sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-sm">
                  <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => table.getColumn('component_name')?.toggleSorting()}
                  >
                    <span className="font-bold text-white">Parent Component</span>
                    {table.getColumn('component_name')?.getIsSorted() === 'asc' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m18 15-6-6-6 6"/></svg>
                    ) : table.getColumn('component_name')?.getIsSorted() === 'desc' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m6 9 6 6 6-6"/></svg>
                    ) : null}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm">
                  <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => table.getColumn('subcomponent_name')?.toggleSorting()}
                  >
                    <span className="font-bold text-white">Sub Component</span>
                    {table.getColumn('subcomponent_name')?.getIsSorted() === 'asc' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m18 15-6-6-6 6"/></svg>
                    ) : table.getColumn('subcomponent_name')?.getIsSorted() === 'desc' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m6 9 6 6 6-6"/></svg>
                    ) : null}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm">
                  <div 
                    className="flex items-center gap-2 cursor-pointer" 
                    onClick={() => table.getColumn('usable_quantity')?.toggleSorting()}
                  >
                    <span className="font-bold text-white">Available Qty</span>
                    {table.getColumn('usable_quantity')?.getIsSorted() === 'asc' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m18 15-6-6-6 6"/></svg>
                    ) : table.getColumn('usable_quantity')?.getIsSorted() === 'desc' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m6 9 6 6 6-6"/></svg>
                    ) : null}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => table.getColumn('damaged_quantity')?.toggleSorting()}
                  >
                    <span className="font-bold text-white">Replaced</span>
                    {table.getColumn('damaged_quantity')?.getIsSorted() === 'asc' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m18 15-6-6-6 6"/></svg>
                    ) : table.getColumn('damaged_quantity')?.getIsSorted() === 'desc' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m6 9 6 6 6-6"/></svg>
                    ) : null}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => table.getColumn('discarded_quantity')?.toggleSorting()}
                  >
                    <span className="font-bold text-white">Damaged</span>
                    {table.getColumn('discarded_quantity')?.getIsSorted() === 'asc' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m18 15-6-6-6 6"/></svg>
                    ) : table.getColumn('discarded_quantity')?.getIsSorted() === 'desc' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m6 9 6 6 6-6"/></svg>
                    ) : null}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => table.getColumn('total_quantity')?.toggleSorting()}
                  >
                    <span className="font-bold text-white">Total Quantity</span>
                    {table.getColumn('total_quantity')?.getIsSorted() === 'asc' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m18 15-6-6-6 6"/></svg>
                    ) : table.getColumn('total_quantity')?.getIsSorted() === 'desc' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m6 9 6 6 6-6"/></svg>
                    ) : null}
                  </div>
                </th>
              </tr>
            </thead>
            
            {/* Table body with proper filtering and sorting */}
            <tbody className="bg-black divide-y divide-gray-800">
              {table.getRowModel().rows.map(row => {
                const parent = row.original;
                // Skip empty parent components
                if (!parent.component_name) return null;
                
                // Get unique subcomponents (remove duplicates)
                const subcomponents = parent.subcomponents || [];
                const uniqueSubcomponents = subcomponents.reduce((acc: any[], curr: any) => {
                  const exists = acc.find(item => item.component_id === curr.component_id);
                  if (!exists) acc.push(curr);
                  return acc;
                }, []);
                
                return (
                  <tr key={row.id} className="hover:bg-[#1E1E1E]">
                    {/* Parent component - vertically centered */}
                    <td className="px-4 py-2 text-sm text-gray-300 align-middle">
                      {parent.component_name}
                    </td>
                    
                    {/* Subcomponents as a list within a single cell */}
                    <td className="px-4 py-2 text-sm text-gray-300">
                      {uniqueSubcomponents.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {uniqueSubcomponents.map((subItem: Subcomponent, subIndex: number) => (
                            <div key={`${subItem.component_id || subIndex}`}>
                              {subItem.component_name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">No subcomponents</span>
                      )}
                    </td>
                    
                    {/* Available quantities as a list */}
                    <td className="px-4 py-2 text-sm">
                      {uniqueSubcomponents.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {uniqueSubcomponents.map((subItem: Subcomponent, subIndex: number) => (
                            <div key={`${subItem.component_id || subIndex}-usable`}>
                              <span className="text-green-400">{subItem.usable_quantity || 0}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    
                    {/* Replaced quantities as a list */}
                    <td className="px-4 py-2 text-sm text-gray-300">
                      {uniqueSubcomponents.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {uniqueSubcomponents.map((subItem: Subcomponent, subIndex: number) => (
                            <div key={`${subItem.component_id || subIndex}-damaged`}>
                              {subItem.damaged_quantity || 0}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    
                    {/* Damaged quantities as a list */}
                    <td className="px-4 py-2 text-sm text-gray-300">
                      {uniqueSubcomponents.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {uniqueSubcomponents.map((subItem: Subcomponent, subIndex: number) => (
                            <div key={`${subItem.component_id || subIndex}-discarded`}>
                              {subItem.discarded_quantity || 0}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    
                    {/* Total quantities as a list */}
                    <td className="px-4 py-2 text-sm text-gray-300">
                      {uniqueSubcomponents.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {uniqueSubcomponents.map((subItem: Subcomponent, subIndex: number) => (
                            <div key={`${subItem.component_id || subIndex}-total`}>
                              {subItem.total_quantity || 0}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
        
        {/* Pagination controls */}
        <div className="mt-4 p-3 border-t border-gray-800">
          {/* Mobile pagination - simplified for small screens */}
          <div className="flex flex-col space-y-3 md:hidden">
            {/* Simple page navigation */}
            <div className="flex justify-between items-center">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 bg-[#232323] text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
              
              <span className="text-white">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
              </span>
              
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 bg-[#232323] text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
            
            {/* Simple page size selector */}
            <div className="flex justify-center items-center">
              <span className="mr-2 text-white">Show:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
                className="bg-[#232323] text-white rounded px-3 py-1"
              >
                {[5, 10, 20, 50, 100].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize} rows
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop pagination - full controls */}
          <div className="hidden md:flex flex-wrap justify-between items-center">
            {/* Page size selector */}
            <div className="flex items-center gap-2">
              <span className="text-white">Rows per page:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
                className="bg-[#232323] text-white rounded px-2 py-1"
              >
                {[5, 10, 20, 50, 100].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-2 py-1 bg-[#232323] text-white rounded disabled:opacity-50"
              >
                {'<<'}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-2 py-1 bg-[#232323] text-white rounded disabled:opacity-50"
              >
                {'<'}
              </button>
              
              <span className="text-white">
                Page{' '}
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount() || 1}
                </strong>
              </span>
              
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-2 py-1 bg-[#232323] text-white rounded disabled:opacity-50"
              >
                {'>'}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-2 py-1 bg-[#232323] text-white rounded disabled:opacity-50"
              >
                {'>>'}
              </button>
            </div>
            
            {/* Page jump */}
            <div className="flex items-center gap-2">
              <span className="text-white">Go to page:</span>
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="bg-[#232323] text-white rounded px-2 py-1 w-16"
                min={1}
                max={table.getPageCount()}
              />
            </div>
          </div>
        </div>
        
        {/* Statistics footer */}
        <div className="mt-3 text-gray-400 text-sm">
          <p>Showing {table.getRowModel().rows.length} of {data.length} entries</p>
        </div>
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
