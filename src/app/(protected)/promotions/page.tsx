
'use client';

import React from 'react';
import { PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { promotions } from '@/lib/data';
import { format } from 'date-fns';

export default function PromotionsPage() {
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold animate-slide-in-up">Promotions</h1>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create Promotion
          </span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in-0">
          <div className="relative z-50 grid w-full max-w-lg translate-y-0 gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-[48%]">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">Create Promotion</h2>
              <p className="text-sm text-muted-foreground">
                Fill in the details for the new promotion.
              </p>
            </div>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium leading-none">
                  Code
                </label>
                <input id="code" defaultValue="SUMMER25" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium leading-none">
                    Type
                  </label>
                  <select id="type" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Select type</option>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="shipping">Free Shipping</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="value" className="text-sm font-medium leading-none">
                    Value
                  </label>
                  <input id="value" type="number" placeholder="e.g. 20 or 15" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm" />
                </div>
              </div>
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <div className="relative">
                    <input type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <div className="relative">
                    <input type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Save Promotion</button>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg bg-card text-card-foreground shadow-sm glassmorphism animate-slide-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-headline text-2xl font-semibold leading-none tracking-tight">
            Promotions & Discounts
          </h3>
          <p className="text-sm text-muted-foreground">
            Create and manage promotional campaigns to drive sales.
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Code</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Value</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Start Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">End Date</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {promotions.map((promo) => (
                  <tr key={promo.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{promo.code}</td>
                    <td className="p-4 align-middle">{promo.type}</td>
                    <td className="p-4 align-middle">{promo.value}</td>
                    <td className="p-4 align-middle">
                      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          promo.status === 'Active' ? 'border-transparent bg-primary text-primary-foreground' : 'text-foreground'
                        }`}
                      >
                        {promo.status}
                      </div>
                    </td>
                    <td className="p-4 align-middle">{promo.startDate}</td>
                    <td className="p-4 align-middle">{promo.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
