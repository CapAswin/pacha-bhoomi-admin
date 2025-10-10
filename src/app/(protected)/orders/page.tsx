
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OrderTable } from '@/components/admin/orders/order-table';
import { columns } from '@/components/admin/orders/order-table-columns';
import { orders } from '@/lib/data';

export default function OrdersPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold animate-slide-in-up">Orders</h1>
      </div>
      <Card className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="font-headline">Order History</CardTitle>
          <CardDescription>
            Manage customer orders and view their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderTable columns={columns} data={orders} />
        </CardContent>
      </Card>
    </>
  );
}
