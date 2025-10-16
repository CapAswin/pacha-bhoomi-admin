
"use client";

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const columns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        className="h-4 w-4 shrink-0 rounded-sm border border-primary"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(value) => table.toggleAllPageRowsSelected(!!value.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="h-4 w-4 shrink-0 rounded-sm border border-primary"
        checked={row.getIsSelected()}
        onChange={(value) => row.toggleSelected(!!value.target.checked)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Product',
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
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Product['status'];
      return (
        <div
          className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize', {
            'bg-green-500/80 text-green-50 hover:bg-green-600 border-green-500': status === 'in stock',
            'bg-orange-500/80 text-orange-50 hover:bg-orange-600 border-orange-500': status === 'low stock',
            'bg-red-500/80 text-red-50 hover:bg-red-600 border-red-500': status === 'out of stock',
          })}
        >
          {status}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => <div className="text-right">{row.getValue('stock')}</div>,
  },
  {
    accessorKey: 'price',
    header: 'Price',
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
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div className="relative">
          <button onClick={() => setIsOpen(!isOpen)} className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-accent">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {isOpen && (
             <div className="absolute right-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                <div className="px-2 py-1.5 text-sm font-semibold">Actions</div>
                <div
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent"
                    onClick={() => {
                        navigator.clipboard.writeText(product.id);
                        setIsOpen(false);
                    }}
                >
                Copy product ID
                </div>
                <div onClick={() => setIsOpen(false)} className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent">Edit</div>
                <div onClick={() => setIsOpen(false)} className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-destructive focus:bg-destructive/10 focus:text-destructive">Delete</div>
          </div>
          )}
        </div>
      );
    },
  },
];
