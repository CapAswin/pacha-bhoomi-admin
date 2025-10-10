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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Order } from '@/lib/types';
import { DataTableColumnHeader } from '@/components/data-table/data-table-columns-header';

export const columns: ColumnDef<Order>[] = [
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
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order ID" />,
  },
  {
    accessorKey: 'customer',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => {
      const customer = row.getValue('customer') as Order['customer'];
      return <div>{customer.name}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
        const status = row.getValue('status') as Order['status'];
        const variant: 'default' | 'secondary' | 'outline' | 'destructive' =
          status === 'Delivered'
            ? 'default'
            : status === 'Shipped'
            ? 'outline'
            : status === 'Processing'
            ? 'secondary'
            : 'destructive';
        return <Badge variant={variant} className="capitalize">{status}</Badge>;
      },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
  },
  {
    accessorKey: 'total',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total'));
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
      const order = row.original;
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
            <DropdownMenuItem>View order details</DropdownMenuItem>
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Update Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
