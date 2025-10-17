'use client';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/lib/types';
import { ProductTable } from '@/components/admin/products/product-table';
import { columns as defineColumns } from '@/components/admin/products/product-table-columns';
import { ProductTableSkeleton } from '@/components/admin/products/product-table-skeleton';
import { PlusCircle, X } from 'lucide-react';
import { ProductForm, ProductFormValues } from '@/components/admin/products/product-form';
import { Button } from '@/components/ui/button';

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

async function addProduct(newProduct: ProductFormValues): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct),
  });
  if (!response.ok) throw new Error('Failed to add product');
  return response.json();
}

async function updateProduct(updatedProduct: { id: string } & Partial<ProductFormValues>): Promise<void> {
    const { id, ...data } = updatedProduct;
    const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update product');
}

async function deleteProduct(productId: string): Promise<void> {
  const response = await fetch(`/api/products/${productId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete product');
}

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: productList = [], isLoading, isError } = useQuery<Product[]>({ queryKey: ['products'], queryFn: fetchProducts });

  const addMutation = useMutation({ mutationFn: addProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) });
  const updateMutation = useMutation({ mutationFn: updateProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) });
  const deleteMutation = useMutation({ mutationFn: deleteProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) });

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleSaveProduct = async (productData: ProductFormValues) => {
    if (editingProduct) {
      await updateMutation.mutateAsync({ id: editingProduct.id as string, ...productData });
    } else {
      await addMutation.mutateAsync(productData);
    }
    handleCloseModal();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteMutation.mutateAsync(productId);
    }
  };

  const columns = defineColumns(handleDeleteProduct, handleOpenModal);

  return (
    <>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-headline font-bold'>Products</h1>
        <Button onClick={() => handleOpenModal()}> 
          <PlusCircle className='h-3.5 w-3.5 mr-2' />
          Add Product
        </Button>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80' onClick={handleCloseModal}>
          <div className='relative z-50 w-full max-w-lg bg-background p-6 shadow-lg sm:rounded-lg' onClick={(e) => e.stopPropagation()}>
            <Button onClick={handleCloseModal} className='absolute top-4 right-4 h-8 w-8 p-0'>
                <X className='h-4 w-4' />
                <span className='sr-only'>Close</span>
            </Button>
            <ProductForm 
              onSubmit={handleSaveProduct} 
              initialData={editingProduct}
              onClose={handleCloseModal} 
            />
          </div>
        </div>
      )}

      <div className='border rounded-lg bg-card text-card-foreground shadow-sm glassmorphism mt-4'>
        <div className='p-6'>
          <h3 className='font-headline text-2xl font-semibold'>Product List</h3>
          <p className='text-sm text-muted-foreground'>Manage your products and view their sales performance.</p>
        </div>
        <div className='p-6 pt-0'>
          {isLoading ? (
            <ProductTableSkeleton />
          ) : isError ? (
            <div>Error loading products.</div>
          ) : (
            <ProductTable columns={columns} data={productList} />
          )}
        </div>
      </div>
    </>
  );
}
