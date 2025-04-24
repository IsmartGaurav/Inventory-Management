"use client";

import { useMemo } from 'react';
import { InventoryItem } from '@/types/inventory';

/**
 * Custom hook that provides an enhanced search function for inventory data
 * This allows searching through both parent components and nested subcomponents
 */
export function useEnhancedSearch() {
  // Enhanced globalFilterFn for better search through nested components
  const enhancedGlobalFilter = useMemo(() => {
    return (row: any, columnId: string, filterValue: string) => {
      // Skip empty searches
      if (!filterValue || typeof filterValue !== 'string') return true;
      
      const searchTerm = filterValue.toLowerCase().trim();
      if (searchTerm === '') return true;
      
      const rowData = row.original;
      
      // Search in parent component name
      if (
        rowData.component_name &&
        rowData.component_name.toLowerCase().includes(searchTerm)
      ) {
        return true;
      }
      
      // Search in parent component SKU
      if (
        rowData.sku_code &&
        rowData.sku_code.toLowerCase().includes(searchTerm)
      ) {
        return true;
      }
      
      // Search in HSN code
      if (
        rowData.hsn_code &&
        rowData.hsn_code.toLowerCase().includes(searchTerm)
      ) {
        return true;
      }
      
      // Search in subcomponents (most important improvement)
      if (rowData.subcomponents && Array.isArray(rowData.subcomponents)) {
        return rowData.subcomponents.some((subcomp: any) => {
          if (!subcomp) return false;
          
          // Search in subcomponent name
          if (
            subcomp.component_name &&
            subcomp.component_name.toLowerCase().includes(searchTerm)
          ) {
            return true;
          }
          
          // Search in subcomponent sku code
          if (
            subcomp.sku_code &&
            subcomp.sku_code.toLowerCase().includes(searchTerm)
          ) {
            return true;
          }
          
          // Search in subcomponent hsn code
          if (
            subcomp.hsn_code &&
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
