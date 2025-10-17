'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import type { Product } from '@/lib/types';

export const columns = (
  handleDelete: (id: string) => void,
  handleEdit: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: 'images',
    header: 'Image',
    cell: ({ row }) => {
      const images = row.getValue('images') as string[];
      const imageUrl = images && images.length > 0 ? images[0] : '/placeholder.svg';
      return <img src={imageUrl} alt="Product Image" className="h-16 w-16 object-cover rounded-md" />;
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">Price</div>,
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
    accessorKey: 'stock',
    header: () => <div className="text-right">Stock</div>,
    cell: ({ row }) => <div className="text-right font-medium">{row.getValue('stock')}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="relative">
          <button
            onClick={() => handleDelete(product.id as string)}
            className="text-destructive hover:text-destructive/80"
          >
            Delete
          </button>
        </div>
      );
    },
  },
];
