import { PlusCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { promotions } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function PromotionsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Promotions</h1>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create Promotion
          </span>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Promotions & Discounts</CardTitle>
          <CardDescription>
            Create and manage promotional campaigns to drive sales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">{promo.code}</TableCell>
                  <TableCell>{promo.type}</TableCell>
                  <TableCell>{promo.value}</TableCell>
                  <TableCell>
                    <Badge variant={promo.status === 'Active' ? 'default' : 'outline'}>{promo.status}</Badge>
                  </TableCell>
                  <TableCell>{promo.startDate}</TableCell>
                  <TableCell>{promo.endDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
