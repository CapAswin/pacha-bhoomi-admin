'use client';

import * as React from 'react';
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CreateProductModal } from './create-product-modal';
import { ProductActions } from './product-actions';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ProductTable<TData extends { id: string }, TValue>({
  columns,
  data: initialData,
}: DataTableProps<TData, TValue>) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [products, setProducts] = React.useState(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const addProduct = (product: { name: string; price: number; description: string }) => {
    const newProduct = {
        ...product,
        id: `product-${products.length + 1}`,
        // You can add other default fields here
    } as TData;
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const augmentedColumns = React.useMemo(
    () => [
      ...columns,
      {
        id: 'actions',
        cell: ({ row }) => (
          <ProductActions 
            onEdit={() => console.log('Edit', row.original)} 
            onDelete={() => {
              setProducts(prev => prev.filter(p => p.id !== (row.original as TData).id));
            }}
          />
        ),
      },
    ],
    [columns, products]
  );

  const table = useReactTable({
    data: products,
    columns: augmentedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => setIsModalOpen(true)}>Create Product</Button>
      </div>
      <div className="border rounded-lg bg-card text-card-foreground shadow-sm glassmorphism mt-4">
        <div className="relative w-full overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={augmentedColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
      <CreateProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addProduct}
      />
    </div>
  );
}
