import { OrderTable } from "@/components/admin/orders/order-table";
import { columns } from "@/components/admin/orders/order-table-columns";
import { orders } from "@/lib/data";
import { useMemo } from "react";

export default function OrdersPage() {
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold animate-slide-in-up">
          Orders
        </h1>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background overflow-auto">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your orders.
            </p>
          </div>
        </div>
        <OrderTable columns={columns} data={sortedOrders} />
      </div>
    </>
  );
}
