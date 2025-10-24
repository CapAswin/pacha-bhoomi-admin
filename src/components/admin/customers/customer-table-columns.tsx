"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Eye, History, Mail } from "lucide-react";
import type { Customer } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    header: "Actions",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <History className="mr-2 h-4 w-4" />
              View order history
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onResetPassword(customer.email)}>
              <Mail className="mr-2 h-4 w-4" />
              Send Password Reset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
