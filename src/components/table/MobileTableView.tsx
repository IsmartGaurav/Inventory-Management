"use client";

import { Table } from '@tanstack/react-table';
import { Subcomponent } from '@/types/component';
import { RowData } from '@/hooks/useEnhancedSearch';

interface MobileTableViewProps {
  table: Table<RowData>;
}

/**
 * Mobile-optimized view for the inventory table
 */
export function MobileTableView({ table }: MobileTableViewProps) {
  return (
    <div className="block md:hidden">
      {table.getRowModel().rows.map(row => {
        const parent = row.original;
        // Skip empty parent components
        if (!parent.component_name) return null;

        // Get unique subcomponents (remove duplicates)
        const subcomponents = parent.subcomponents || [];
        // Cast to Subcomponent[] to ensure type compatibility
        const typedSubcomponents = subcomponents as unknown as Subcomponent[];
        const uniqueSubcomponents = typedSubcomponents.reduce((acc: Subcomponent[], curr: Subcomponent) => {
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
  );
}
