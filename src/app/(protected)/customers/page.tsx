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
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function CustomersPage() {
  const auth = useAuth();
  const { toast } = useToast();

  const handleResetPassword = async (email: string) => {
    if (!auth) return;
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset Email Sent',
        description: `An email has been sent to ${email} to reset their password.`,
      });
    } catch (error: any) {
      console.error('Failed to send password reset email:', error);
      toast({
        variant: 'destructive',
        title: 'Operation Failed',
        description:
          error.message ||
          'Could not send password reset email. Please try again.',
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Customers</h1>
      </div>
      <Card>
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
