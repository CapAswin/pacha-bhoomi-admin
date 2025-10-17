
'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';

import { columns } from '@/components/admin/categories/category-table-columns';
import { DataTable } from '@/components/admin/categories/category-table';
import { categorySchema, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CategoryForm } from '@/components/admin/categories/category-form';

async function getCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await response.json();
  return z.array(categorySchema).parse(data);
}

async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    throw new Error('Failed to create category');
  }
  return await response.json();
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleCreate = async (values: Omit<Category, 'id'>) => {
    try {
      const newCategory = await createCategory(values);
      setCategories([...categories, newCategory]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your product categories.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={handleCreate}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable data={categories} columns={columns} />
    </div>
  );
}
