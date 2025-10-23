"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { Promotion } from "@/lib/types";

export const columns: ColumnDef<Promotion>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            status === "Active"
              ? "border-transparent bg-primary text-primary-foreground"
              : "text-foreground"
          }`}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Start Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("startDate") as string;
      return <div>{date}</div>;
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const date = row.getValue("endDate") as string;
      return <div>{date}</div>;
    },
  },
];
