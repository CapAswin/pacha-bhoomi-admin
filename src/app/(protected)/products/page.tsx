import { Bot, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProductTable } from '@/components/admin/products/product-table';
import { columns } from '@/components/admin/products/product-table-columns';
import { products } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

export default function ProductsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Products</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details for the new product.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue="Organic Turmeric Powder"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <div className="col-span-3 relative">
                  <Textarea
                    id="description"
                    defaultValue="High-quality organic turmeric powder, sourced sustainably."
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 h-7 w-7 text-accent"
                  >
                    <Bot className="h-4 w-4" />
                    <span className="sr-only">Generate with AI</span>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  defaultValue="12.99"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  defaultValue="150"
                  className="col-span-3"
                />
              </div>
              <Separator />
               <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Images</Label>
                <div className="col-span-3 space-y-2">
                  <div>
                    <Label htmlFor="primary-image" className="text-sm font-medium">Primary Image</Label>
                    <Input id="primary-image" type="file" className="mt-1" />
                  </div>
                  <div>
                     <Label htmlFor="additional-image-1" className="text-sm font-medium">Additional Images (up to 4)</Label>
                    <Input id="additional-image-1" type="file" className="mt-1" />
                    <Input id="additional-image-2" type="file" className="mt-2" />
                    <Input id="additional-image-3" type="file" className="mt-2" />
                    <Input id="additional-image-4" type="file" className="mt-2" />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Product List</CardTitle>
          <CardDescription>
            Manage your products and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductTable columns={columns} data={products} />
        </CardContent>
      </Card>
    </>
  );
}
