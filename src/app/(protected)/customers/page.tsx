
'use client';

import { CustomerTable } from '@/components/admin/customers/customer-table';
import { columns } from '@/components/admin/customers/customer-table-columns';
import { customers } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function CustomersPage() {
  const { toast } = useToast();

  const handleResetPassword = async (email: string) => {
    toast({
      title: 'Action Not Available',
      description: `Password management has been disabled.`,
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold animate-slide-in-up">Customers</h1>
      </div>
      <div className="border rounded-lg bg-card text-card-foreground shadow-sm glassmorphism animate-slide-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight font-headline">Customer List</h3>
          <p className="text-sm text-muted-foreground">
            View and manage your customer base.
          </p>
        </div>
        <div className="p-6 pt-0">
          <CustomerTable
            columns={columns(handleResetPassword)}
            data={customers}
          />
        </div>
      </div>
    </>
  );
}
