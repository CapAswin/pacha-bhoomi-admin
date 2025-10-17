'use client';

import React, { useState } from 'react';
import { Category } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export type CategoryFormValues = {
  name: string;
  description: string;
};

interface CategoryFormProps {
  onSubmit: (values: CategoryFormValues) => void;
  initialData?: Category | null;
  onCancel?: () => void;
}

export function CategoryForm({ onSubmit, initialData, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="description">Description</label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Category Description"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{initialData ? 'Save Changes' : 'Create Category'}</Button>
      </div>
    </form>
  );
}
