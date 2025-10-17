'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export interface ProductFormData {
  name: string;
  price: number;
  description: string;
}

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  initialData?: Partial<ProductFormData>;
  onCancel?: () => void;
}

export function ProductForm({ onSubmit, initialData, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      price: parseFloat(price) || 0,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
        <Input id="name" placeholder="Enter product name" className="mt-1" value={name} onChange={e => setName(e.target.value)} required/>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
        <Input id="price" type="number" placeholder="0.00" className="mt-1" value={price} onChange={e => setPrice(e.target.value)} required/>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <Textarea id="description" placeholder="Enter product description" className="mt-1" value={description} onChange={e => setDescription(e.target.value)} />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
            <Button variant="outline" onClick={onCancel} type="button">
              Cancel
            </Button>
        )}
        <Button type="submit">
          Save Product
        </Button>
      </div>
    </form>
  );
}
