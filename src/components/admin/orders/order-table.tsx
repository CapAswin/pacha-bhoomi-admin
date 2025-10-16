"use client";

import * as React from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function OrderTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          placeholder="Filter orders by customer..."
          value={(table.getColumn('customer')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('customer')?.setFilterValue(event.target.value)
          }
          className="max-w-sm flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm"
        />
      </div>
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50">
                    {headerGroup.headers.map((header) => {
                    return (
                        <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                        </th>
                    );
                    })}
                </tr>
                ))}
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
                {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <tr
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="border-b transition-colors hover:bg-muted/50"
                    >
                    {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-4 align-middle">
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                        </td>
                    ))}
                    </tr>
                ))
                ) : (
                <tr>
                    <td
                    colSpan={columns.length}
                    className="h-24 text-center p-4 align-middle"
                    >
                    No results.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
            <button
                className="hidden h-8 w-8 p-0 lg:flex items-center justify-center rounded-md border hover:bg-accent"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
            >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
                className="h-8 w-8 p-0 flex items-center justify-center rounded-md border hover:bg-accent"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
            </button>
            <button
                className="h-8 w-8 p-0 flex items-center justify-center rounded-md border hover:bg-accent"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
            </button>
            <button
                className="hidden h-8 w-8 p-0 lg:flex items-center justify-center rounded-md border hover:bg-accent"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
            >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
            </button>
            </div>
        </div>
        </div>
    </div>
  );
}
