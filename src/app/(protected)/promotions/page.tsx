"use client";

import React from "react";
import { PlusCircle, Calendar as CalendarIcon, X } from "lucide-react";
import { promotions } from "@/lib/data";
import { format } from "date-fns";
import { PromotionTable } from "@/components/admin/promotions/promotion-table";
import { columns } from "@/components/admin/promotions/promotion-table-columns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PromotionsPage() {
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [promotionType, setPromotionType] = React.useState<string>("");

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background overflow-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Promotions</h2>
            <p className="text-muted-foreground">
              Here's a list of your promotions.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Create Promotion</Button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in-0">
            <div className="relative z-50 grid w-full max-w-lg translate-y-0 gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-[48%]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  Create Promotion
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fill in the details for the new promotion.
                </p>
              </div>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <label
                    htmlFor="code"
                    className="text-sm font-medium leading-none"
                  >
                    Code
                  </label>
                  <input
                    id="code"
                    defaultValue="SUMMER25"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="type"
                      className="text-sm font-medium leading-none"
                    >
                      Type
                    </label>
                    <Select onValueChange={setPromotionType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="shipping">Free Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="value"
                      className="text-sm font-medium leading-none"
                    >
                      Value
                    </label>
                    <input
                      id="value"
                      type="number"
                      placeholder="e.g. 20 or 15"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Save Promotion
                </button>
              </div>
            </div>
          </div>
        )}

        <PromotionTable columns={columns} data={promotions} />

        <PromotionTable columns={columns} data={promotions} />
      </div>
    </>
  );
}
