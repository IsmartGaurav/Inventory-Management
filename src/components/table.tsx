"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';
import { columns } from './columns';
import { InventoryItem } from '@/types/inventory';
import { ChevronUp, ChevronDown, Search, RefreshCw, AlertTriangle } from 'lucide-react';

// Import mock data properly with ES modules syntax
import { mockInventoryData } from '@/data/mockInventory';

export function InventoryTable() {
  // State management
  const [data, setData] = useState<InventoryItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [useMockData, setUseMockData] = useState<boolean>(false);

  // Fetch inventory data from API with fallback to mock data
  const fetchInventoryData = async (useMock = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If useMock is true or we've previously set useMockData, use mock data
      if (useMock || useMockData) {
        console.log('Using mock inventory data');
        setUseMockData(true);
        setData(mockInventoryData);
        return;
      }
      
      // Otherwise, try to fetch from API
      const API_URL = '/api/inventory';
      console.log('Fetching inventory data from internal API route');
      
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch inventory data: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      if (!responseData || responseData.error) {
        console.warn('API returned error or empty data, falling back to mock data');
        setUseMockData(true);
        setData(mockInventoryData);
      } else {
        console.log('Inventory data fetched successfully:', responseData.length, 'items');
        setData(responseData);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching inventory data:', errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.log('Falling back to mock data due to error');
      setUseMockData(true);
      setData(mockInventoryData);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize fetchInventoryData function to avoid dependency issues
  const memoizedFetchData = useCallback(fetchInventoryData, []);
  
  // Fetch data on component mount
  useEffect(() => {
    memoizedFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Process data to extract subcomponents with parent component information
  const processedData = useMemo(() => {
    if (!data) return [];

    // Extract subcomponents and add parent component name for display
    const flattenedData = data.flatMap(parentItem => {
      // Only process items that have subcomponents
      if (parentItem.subcomponents && parentItem.subcomponents.length > 0) {
        // Map each subcomponent to include parent component name
        return parentItem.subcomponents.map(subcomp => ({
          ...subcomp,
          parent_component_name: parentItem.component_name
        }));
      }
      return [];
    });

    console.log('Processed data:', flattenedData.length, 'subcomponents found');
    return flattenedData;
  }, [data]);
  
  // Table instance with all features
  const table = useReactTable({
    data: processedData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    enableSorting: true,
    enableFilters: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
      // Default sorting by parent component name
      sorting: [
        { id: 'parent_component_name', desc: false }
      ],
    },
  });

  // Loading, error and empty states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-[#1A1A1A] rounded-lg">
        <div className="flex items-center gap-2 text-white">
          <RefreshCw className="animate-spin h-5 w-5" />
          <span>Loading inventory data...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center p-8 bg-[#1A1A1A] rounded-lg">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <span>Error loading inventory: {error.message}</span>
        </div>
      </div>
    );
  }
  
  if (!data || processedData.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-[#1A1A1A] rounded-lg">
        <span className="text-yellow-400">No inventory data found.</span>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 bg-[#1A1A1A] rounded-lg shadow-lg">
      {/* Header with title and search/filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">Inventory Components</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Global search input */}
          <div className="relative flex-1 md:flex-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search inventory..."
              className="block w-full bg-[#232323] text-white border-0 rounded-md py-2 pl-10 pr-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-2">
            {/* Refresh button */}
            <button
              onClick={() => fetchInventoryData(false)}
              className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none"
              title="Refresh data from API"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Refresh</span>
            </button>
            
            {/* Toggle mock data button */}
            <button
              onClick={() => fetchInventoryData(!useMockData)}
              className={`inline-flex items-center justify-center px-3 py-2 text-white text-sm rounded-md focus:outline-none ${useMockData ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'}`}
              title={useMockData ? 'Using mock data - Click to try API' : 'Using API data - Click for mock data'}
            >
              <span>{useMockData ? 'Using Mock' : 'Using API'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Responsive table container */}
      <div className="overflow-x-auto bg-[#121212] rounded-lg shadow-xl">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-[#1E1E1E]">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-sm md:text-base tracking-wider text-white"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-2">
                        {/* Column header with sort button */}
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className={`flex items-center gap-1 ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                          title={header.column.getCanSort() ? `Sort by ${header.column.id}` : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          
                          {/* Sort indicators */}
                          {{
                            asc: <ChevronUp className="h-4 w-4 text-blue-400" />,
                            desc: <ChevronDown className="h-4 w-4 text-blue-400" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </button>
                        
                        {/* Column filter input (only for columns that can be filtered) */}
                        {header.column.getCanFilter() ? (
                          <input
                            type="text"
                            value={(header.column.getFilterValue() as string) ?? ''}
                            onChange={e => header.column.setFilterValue(e.target.value)}
                            placeholder={`Filter...`}
                            className="mt-1 w-full text-xs bg-[#2A2A2A] text-white border-0 rounded p-1 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        ) : null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-black divide-y divide-gray-800">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-[#1E1E1E] transition-colors duration-150">
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-3 md:px-6 py-2 md:py-4 text-sm md:text-md text-gray-300"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="px-6 py-4 text-center text-sm text-gray-400"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls - Responsive design */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-white">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Rows per page:</label>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="bg-[#232323] text-white border-0 rounded py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {[5, 10, 20, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        
        {/* Pagination navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className={`px-3 py-1 rounded ${!table.getCanPreviousPage() ? 'bg-gray-800 text-gray-500' : 'bg-[#232323] hover:bg-[#2A2A2A]'}`}
            aria-label="First page"
          >
            «
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`px-3 py-1 rounded ${!table.getCanPreviousPage() ? 'bg-gray-800 text-gray-500' : 'bg-[#232323] hover:bg-[#2A2A2A]'}`}
            aria-label="Previous page"
          >
            ‹
          </button>
          
          <span className="flex items-center gap-1 text-sm">
            <span className="hidden sm:inline">Page</span>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
          
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`px-3 py-1 rounded ${!table.getCanNextPage() ? 'bg-gray-800 text-gray-500' : 'bg-[#232323] hover:bg-[#2A2A2A]'}`}
            aria-label="Next page"
          >
            ›
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className={`px-3 py-1 rounded ${!table.getCanNextPage() ? 'bg-gray-800 text-gray-500' : 'bg-[#232323] hover:bg-[#2A2A2A]'}`}
            aria-label="Last page"
          >
            »
          </button>
        </div>
        
        {/* Page jump controls */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-gray-400">Go to page:</span>
          <input
            type="number"
            min={1}
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="bg-[#232323] text-white border-0 rounded w-16 py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}