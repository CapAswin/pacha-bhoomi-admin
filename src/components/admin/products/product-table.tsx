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
import { useModal } from '@/context/modal-context';
import { ProductFormValues } from './product-form';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDeleteProduct: (id: string) => void;
}

export function ProductTable<TData extends { id: string }, TValue>({
  columns,
  data: initialData,
  onDeleteProduct,
}: DataTableProps<TData, TValue>) {
  const { openModal } = useModal();
  const [products, setProducts] = React.useState<TData[]>(initialData ?? []);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    if (initialData) {
      setProducts(initialData);
    }
  }, [initialData]);

  const addProduct = (product: ProductFormValues) => {
    const newProduct = {
      ...product,
      id: `new-product-${Date.now()}`,
    } as TData;
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const augmentedColumns = React.useMemo(() => {
    const filteredColumns = columns.filter(
      (column) => (column as any).id !== 'actions' && (column as any).accessorKey !== 'actions'
    );

    return [
      ...filteredColumns,
      {
        id: 'actions',
        cell: ({ row }) => (
          <ProductActions 
            onEdit={() => console.log('Edit', row.original)} 
            onDelete={() => onDeleteProduct((row.original as TData).id)}
          />
        ),
      },
    ];
  }, [columns, onDeleteProduct]);

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
    getRowId: (row) => (row as TData).id,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => openModal('createProduct')}>Create Product</Button>
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
      <CreateProductModal onSave={addProduct} />
    </div>
  );
}
