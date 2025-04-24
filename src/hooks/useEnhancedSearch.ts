"use client";

import { useMemo } from 'react';

/**
 * Custom hook that provides an enhanced search function for inventory data
 * This allows searching through both parent components and nested subcomponents
 */
// Define interfaces to make the types more specific
export interface SearchableComponent {
  component_name?: string;
  component_id?: string;
  sku_code?: string;
  hsn_code?: string;
  [key: string]: unknown;
}

export interface RowData extends SearchableComponent {
  subcomponents?: SearchableComponent[];
}

export function useEnhancedSearch() {
  // Enhanced globalFilterFn for better search through nested components
  const enhancedGlobalFilter = useMemo(() => {
    return (row: { original: RowData; getValue: (columnId: string) => unknown }, columnId: string, filterValue: string) => {
      // Skip empty searches
      if (!filterValue || typeof filterValue !== 'string') return true;
      
      const searchTerm = filterValue.toLowerCase().trim();
      if (searchTerm === '') return true;
      
      const rowData: RowData = row.original;
      
      // Search in parent component name
      if (
        rowData.component_name &&
        typeof rowData.component_name === 'string' &&
        rowData.component_name.toLowerCase().includes(searchTerm)
      ) {
        return true;
      }
      
      // Search in parent component SKU
      if (
        rowData.sku_code &&
        typeof rowData.sku_code === 'string' &&
        rowData.sku_code.toLowerCase().includes(searchTerm)
      ) {
        return true;
      }
      
      // Search in HSN code
      if (
        rowData.hsn_code &&
        typeof rowData.hsn_code === 'string' &&
        rowData.hsn_code.toLowerCase().includes(searchTerm)
      ) {
        return true;
      }
      
      // Search in subcomponents (most important improvement)
      if (rowData.subcomponents && Array.isArray(rowData.subcomponents)) {
        return rowData.subcomponents.some((subcomp: SearchableComponent) => {
          if (!subcomp) return false;
          
          // Search in subcomponent name
          if (
            subcomp.component_name &&
            typeof subcomp.component_name === 'string' &&
            subcomp.component_name.toLowerCase().includes(searchTerm)
          ) {
            return true;
          }
          
          // Search in subcomponent sku code
          if (
            subcomp.sku_code &&
            typeof subcomp.sku_code === 'string' &&
            subcomp.sku_code.toLowerCase().includes(searchTerm)
          ) {
            return true;
          }
          
          // Search in subcomponent hsn code
          if (
            subcomp.hsn_code &&
            typeof subcomp.hsn_code === 'string' &&
            subcomp.hsn_code.toLowerCase().includes(searchTerm)
          ) {
            return true;
          }
          
          return false;
        });
      }
      
      // Default behavior for other fields
      const value = row.getValue(columnId);
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm);
      }
      
      return false;
    };
  }, []);

  return { enhancedGlobalFilter };
}
