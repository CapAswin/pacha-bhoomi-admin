"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import type { Customer } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";

export const columns = (
  onResetPassword: (email: string) => void
): ColumnDef<Customer>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "orders",
    header: "Orders",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("orders")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");
      if (!createdAt) {
        return <div>-</div>;
      }
      const date = new Date(createdAt as string);
      if (isNaN(date.getTime())) {
        return <div>-</div>;
      }
      const formattedDate = new Intl.DateTimeFormat("en-US").format(date);
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "totalSpent",
    header: "Total Spent",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalSpent"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {isOpen && (
            <div className="absolute right-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
              <div className="px-2 py-1.5 text-sm font-semibold">Actions</div>
              <div
                className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => setIsOpen(false)}
              >
                View profile
              </div>
              <div
                className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => setIsOpen(false)}
              >
                View order history
              </div>
              <hr className="-mx-1 my-1 h-px bg-muted" />
              <div
                className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => {
                  onResetPassword(customer.email);
                  setIsOpen(false);
                }}
              >
                Send Password Reset
              </div>
            </div>
          )}
        </div>
      );
    },
  },
];
