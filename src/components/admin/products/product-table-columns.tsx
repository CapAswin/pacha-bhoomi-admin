"use client";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import type { Product } from "@/lib/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type ProductColumnDef = ColumnDef<Product> & {
  handleDelete?: (id: string) => void;
};

export const columns = (
  handleDelete: (id: string) => void,
  handleEdit: (product: Product) => void
): ProductColumnDef[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-right">Stock</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("stock")}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 w-8 p-0 flex items-center justify-center"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {isOpen && (
             <div className="absolute right-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                <div 
                    onClick={() => {
                        handleEdit(product);
                        setIsOpen(false);
                    }} 
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent"
                >
                    Edit
                </div>
                <div 
                    onClick={() => {
                        handleDelete(product.id as string);
                        setIsOpen(false);
                    }}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                    Delete
                </div>
          </div>
          )}
        </div>
      );
    },
  },
];
