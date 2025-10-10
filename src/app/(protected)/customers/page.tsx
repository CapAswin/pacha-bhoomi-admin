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

export default function CustomersPage() {
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
          <CustomerTable columns={columns} data={customers} />
        </CardContent>
      </Card>
    </>
  );
}
