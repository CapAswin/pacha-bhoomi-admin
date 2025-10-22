"use client";

import { CustomerTable } from "@/components/admin/customers/customer-table";
import { columns } from "@/components/admin/customers/customer-table-columns";
import { customers } from "@/lib/data";

export default function CustomersPage() {
  const handleResetPassword = async (email: string) => {
    console.log(`Password reset for ${email} is not available .`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold animate-slide-in-up">
          Customers
        </h1>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background overflow-auto">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your customers.
            </p>
          </div>
        </div>
        <CustomerTable
          columns={columns(handleResetPassword)}
          data={customers}
        />
      </div>
    </>
  );
}
