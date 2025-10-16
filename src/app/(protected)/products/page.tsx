
'use client';

import React from 'react';
import { Bot, PlusCircle } from 'lucide-react';
import { products } from '@/lib/data';
import {
  generateProductDescription,
  type GenerateProductDescriptionInput,
} from '@/ai/ai-product-description';
import type { Product } from '@/lib/types';
import { ProductTable } from '@/components/admin/products/product-table';
import { columns } from '@/components/admin/products/product-table-columns';

export default function ProductsPage() {
  const [description, setDescription] = React.useState(
    'High-quality organic turmeric powder, sourced sustainably.'
  );
  const [productList, setProductList] = React.useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    setProductList(products);
  }, []);

  async function handleGenerateDescription() {
    try {
      const input: GenerateProductDescriptionInput = {
        attributes: 'organic, non-gmo, sustainably-sourced',
        keywords: 'turmeric, spice, health, antioxidant',
        style: 'Informative and appealing',
      };
      const result = await generateProductDescription(input);
      if (result.description) {
        setDescription(result.description);
      }
    } catch (error) {
      console.error('Failed to generate description:', error);
    }
  }

  async function handleSaveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      inventory: formData.get('stock') as string,
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      const newProduct = await response.json();
      setProductList([newProduct, ...productList]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold animate-slide-in-up">Products</h1>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Product
          </span>
        </button>
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in-0">
           <form onSubmit={handleSaveProduct} className="relative z-50 grid w-full max-w-lg translate-y-0 gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-[48%]">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">Add New Product</h2>
              <p className="text-sm text-muted-foreground">
                Fill in the details for the new product.
              </p>
            </div>
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  defaultValue="Organic Turmeric Powder"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-10"
                    rows={4}
                  />
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 h-7 w-7 text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
                    onClick={handleGenerateDescription}
                  >
                    <Bot className="h-4 w-4" />
                    <span className="sr-only">Generate with AI</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Price
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue="12.99"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="stock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Stock
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    defaultValue="150"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                </div>
              </div>
              <hr className="shrink-0 bg-border h-[1px] w-full" />
               <div className="space-y-4">
                 <h3 className="text-sm font-medium">Images</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="primary-image">Primary Image</label>
                  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="primary-image" type="file" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="additional-images">Additional Images</label>
                  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="additional-images" type="file" multiple />
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <button type="submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Save Product</button>
            </div>
           </form>
        </div>
      )}

      <div className="border rounded-lg bg-card text-card-foreground shadow-sm glassmorphism animate-slide-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-headline text-2xl font-semibold leading-none tracking-tight">Product List</h3>
          <p className="text-sm text-muted-foreground">
            Manage your products and view their sales performance.
          </p>
        </div>
        <div className="p-6 pt-0">
            <ProductTable columns={columns} data={productList} />
        </div>
      </div>
    </>
  );
}
