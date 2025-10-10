
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CustomerTable } from '@/components/admin/customers/customer-table';
import { columns } from '@/components/admin/customers/customer-table-columns';
import { customers } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function CustomersPage() {
  const { toast } = useToast();

  const handleResetPassword = async (email: string) => {
    // This functionality is removed as login is removed.
    // We can show a toast message indicating the action is no longer available.
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
      <Card className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="font-headline">Customer List</CardTitle>
          <CardDescription>
            View and manage your customer base.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerTable
            columns={columns(handleResetPassword)}
            data={customers}
          />
        </CardContent>
      </Card>
    </>
  );
}
