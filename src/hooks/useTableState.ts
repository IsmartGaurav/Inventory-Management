"use client";

import { useState, useMemo } from 'react';
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  TableOptions,
} from '@tanstack/react-table';
import { InventoryItem } from '@/types/inventory';
import { useEnhancedSearch } from './useEnhancedSearch';

/**
 * Custom hook to manage table state and configuration
 * Extracts table state management logic from the table component
 */
export function useTableState(
  data: any[], 
  columns: any[]
) {
  // Table state with optimization for performance
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Get the enhanced search functionality
  const { enhancedGlobalFilter } = useEnhancedSearch();

  // Create TanStack Table instance with all features enabled
  const table = useReactTable({
    data: data as unknown as InventoryItem[],
    columns,
    state: { 
      sorting, 
      columnFilters, 
      globalFilter,
      pagination
    },
    globalFilterFn: enhancedGlobalFilter, // Use our improved search function
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

  return {
    table,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination
  };
}
