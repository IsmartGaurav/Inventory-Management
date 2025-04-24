'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { InventoryItem } from '@/types/inventory';
import { AlertCircle } from 'lucide-react';

const columnHelper = createColumnHelper<InventoryItem>();

export const columns = [
  // Parent Component Column
  columnHelper.accessor('parent_component_name', {
    header: () => <span className="font-bold text-white">Parent Component</span>,
    cell: info => info.getValue() || 'N/A',
    enableSorting: true,
    enableColumnFilter: false, // Removed filter as requested
  }),

  // Component Name Column
  columnHelper.accessor('component_name', {
    header: () => <span className="font-bold text-white">Sub Component</span>,
    cell: info => info.getValue(),
    enableSorting: true,
    enableColumnFilter: false, // Removed filter as requested
  }),

  // Available/Usable Quantity Column
  columnHelper.accessor('usable_quantity', {
    header: () => <span className="font-bold text-white">Available Qty</span>,
    cell: info => {
      const value = info.getValue();
      return value !== undefined ? 
        <span className="text-green-400">{value}</span> : 
        'N/A';
    },
    enableSorting: true,
  }),

  // Replaced/Damaged Quantity Column
  columnHelper.accessor('damaged_quantity', {
    header: () => <span className="font-bold text-white">Replaced</span>,
    cell: info => {
      const value = info.getValue();
      return value !== undefined ? value : 'N/A';
    },
    enableSorting: true,
  }),

  // Damaged Quantity Column
  columnHelper.accessor('discarded_quantity', {
    header: () => <span className="font-bold text-white">Damaged</span>,
    cell: info => {
      const value = info.getValue();
      return value !== undefined ? value : 'N/A';
    },
    enableSorting: true,
  }),

  // Alert Status Column
  columnHelper.accessor(row => {
    // Add null checks to prevent crashes
    if (!row) return 'Unknown';
    
    const usable = row.usable_quantity || 0;
    const total = row.total_quantity || 0;
    // Consider low stock if less than 30% of total available
    if (total > 0 && usable / total < 0.3) {
      return usable === 0 ? 'Out of Stock' : 'Low Stock';
    }
    return 'In Stock';
  }, {
    id: 'alert',
    header: () => <span className="font-bold text-white">Alert</span>,
    enableColumnFilter: false, // Removed filter as requested
    cell: info => {
      const status = info.getValue();
      if (status === 'Out of Stock') {
        return <span className="text-red-500 font-medium flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          Out of Stock
        </span>;
      } else if (status === 'Low Stock') {
        return <span className="text-amber-500 font-medium">Low Stock</span>;
      }
      return null;
    },
    enableSorting: true,
  }),

  // Action Column
  columnHelper.accessor(row => {
    // Add null checks to prevent crashes
    if (!row) return '';
    const usable = row.usable_quantity || 0;
    return usable < 10 ? 'Raise STO' : '';
  }, {
    id: 'action',
    header: () => <span className="font-bold text-white">Action</span>,
    enableColumnFilter: false, // Removed filter as requested
    cell: info => {
      const action = info.getValue();
      return action ? (
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1 px-2 rounded-md"
        >
          Raise STO
        </button>
      ) : null;
    },
    enableSorting: false,
  }),
];