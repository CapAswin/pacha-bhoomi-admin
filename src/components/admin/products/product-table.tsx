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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ProductTable<TData, TValue>({
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
          placeholder="Filter products..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
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
      {/* <DataTablePagination table={table} /> */}
    </div>
  );
}
