import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { orders } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function RecentOrders() {
    const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-2');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Sales</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.slice(0, 5).map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {userAvatar && <Image
                        src={userAvatar.imageUrl}
                        alt="User avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                        data-ai-hint={userAvatar.imageHint}
                    />}
                    <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} className="capitalize">{order.status}</Badge>
                </TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
