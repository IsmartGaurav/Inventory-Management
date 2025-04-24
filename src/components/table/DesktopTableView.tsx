"use client";

import { Table } from '@tanstack/react-table';
import { Subcomponent } from '@/types/inventory';

interface DesktopTableViewProps {
  table: Table<any>;
}

/**
 * Desktop-optimized view for the inventory table
 */
export function DesktopTableView({ table }: DesktopTableViewProps) {
  return (
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
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Sub Component</span>
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
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Total Quantity</span>
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
            const uniqueSubcomponents = subcomponents.reduce((acc: Subcomponent[], curr: Subcomponent) => {
              const exists = acc.find(item => item.component_id === curr.component_id);
              if (!exists) acc.push(curr);
              return acc;
            }, [] as Subcomponent[]);
            
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
  );
}
