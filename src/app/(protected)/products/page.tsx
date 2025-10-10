
'use client';

import React from 'react';
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
import {
  generateProductDescription,
  type GenerateProductDescriptionInput,
} from '@/ai/ai-product-description';
import { useToast } from '@/hooks/use-toast';

export default function ProductsPage() {
  const { toast } = useToast();
  const [description, setDescription] = React.useState(
    'High-quality organic turmeric powder, sourced sustainably.'
  );
  const [isGenerating, setIsGenerating] = React.useState(false);

  async function handleGenerateDescription() {
    setIsGenerating(true);
    try {
      const input: GenerateProductDescriptionInput = {
        attributes: 'organic, non-gmo, sustainably-sourced',
        keywords: 'turmeric, spice, health, antioxidant',
        style: 'Informative and appealing',
      };
      const result = await generateProductDescription(input);
      if (result.description) {
        setDescription(result.description);
        toast({
          title: 'Description Generated',
          description: 'The AI-powered description has been generated.',
        });
      }
    } catch (error) {
      console.error('Failed to generate description:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'Could not generate a new description. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold animate-slide-in-up">Products</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details for the new product.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue="Organic Turmeric Powder"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description
                </Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="pr-10"
                    rows={4}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 h-7 w-7 text-accent-foreground"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                  >
                    <Bot className="h-4 w-4" />
                    <span className="sr-only">Generate with AI</span>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    defaultValue="12.99"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    defaultValue="150"
                  />
                </div>
              </div>
              <Separator />
               <div className="space-y-4">
                 <h3 className="text-sm font-medium">Images</h3>
                <div className="space-y-2">
                  <Label htmlFor="primary-image">Primary Image</Label>
                  <Input id="primary-image" type="file" />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="additional-images">Additional Images</Label>
                  <Input id="additional-images" type="file" multiple />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
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
