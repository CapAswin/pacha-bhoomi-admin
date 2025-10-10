
"use client";

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Product } from '@/lib/types';
import { DataTableColumnHeader } from '@/components/data-table/data-table-columns-header';
import Image from 'next/image';

export const columns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Product" />,
    cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-3">
            {product.images && product.images.length > 0 && (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            )}
            <span>{product.name}</span>
          </div>
        );
      },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as Product['status'];
      const variant: 'outline' | 'secondary' | 'destructive' =
        status === 'in stock'
          ? 'outline'
          : status === 'low stock'
          ? 'secondary'
          : 'destructive';
      return <Badge variant={variant} className="capitalize">{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
    cell: ({ row }) => <div className="text-right">{row.getValue('stock')}</div>,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
