
'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';

import { columns } from '@/components/admin/categories/category-table-columns';
import { DataTable } from '@/components/admin/categories/category-table';
import { categorySchema, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useModal } from '@/context/modal-context';
import { CategoryModal } from '@/components/admin/categories/category-modal';

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

async function updateCategory(id: string, category: Omit<Category, 'id'>): Promise<Category> {
    const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
    });
    if (!response.ok) {
        throw new Error('Failed to update category');
    }
    return await response.json();
}

async function deleteCategory(id: string): Promise<void> {
    const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete category');
    }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { openModal } = useModal();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleCreate = async (values: Omit<Category, 'id'>) => {
    try {
      const newCategory = await createCategory(values);
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id: string, values: Omit<Category, 'id'>) => {
    try {
      const updatedCategory = await updateCategory(id, values);
      setCategories(categories.map(c => c.id === id ? updatedCategory : c));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <CategoryModal onCreate={handleCreate} onEdit={handleEdit} />
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your product categories.
          </p>
        </div>
        <Button onClick={() => openModal('createCategory')}>Create Category</Button>
      </div>
      <DataTable data={categories} columns={columns} meta={{ onDelete: handleDelete }} />
    </div>
  );
}
