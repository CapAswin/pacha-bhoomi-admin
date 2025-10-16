
import { OrderTable } from '@/components/admin/orders/order-table';
import { columns } from '@/components/admin/orders/order-table-columns';
import { orders } from '@/lib/data';

export default function OrdersPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold animate-slide-in-up">Orders</h1>
      </div>
      <div className="border rounded-lg bg-card text-card-foreground shadow-sm glassmorphism animate-slide-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-headline text-2xl font-semibold leading-none tracking-tight">Order History</h3>
          <p className="text-sm text-muted-foreground">
            Manage customer orders and view their details.
          </p>
        </div>
        <div className="p-6 pt-0">
          <OrderTable columns={columns} data={orders} />
        </div>
      </div>
    </>
  );
}
