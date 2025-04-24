"use client";

import { Table } from '@tanstack/react-table';

interface TablePaginationProps {
  table: Table<any>;
}

/**
 * Pagination component for the table with responsive design
 */
export function TablePagination({ table }: TablePaginationProps) {
  return (
    <div className="mt-4 px-2">
      {/* Mobile pagination - simplified */}
      <div className="flex flex-col md:hidden">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-[#232323] text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-white">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-[#232323] text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Mobile page size selector */}
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">Rows:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="bg-[#232323] text-white text-sm rounded px-2 py-1"
            >
              {[5, 10, 20, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} rows
                </option>
              ))}
            </select>
          </div>
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
      
      {/* Statistics footer */}
      <div className="mt-3 text-gray-400 text-sm">
        <p>Showing {table.getRowModel().rows.length} of {table.getCoreRowModel().rows.length} entries</p>
      </div>
    </div>
  );
}
