'use client';

import { useModal } from '@/context/modal-context';
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/types';

interface CategoryActionsProps {
  category: Category;
  onDelete: (id: string) => void;
}

export function CategoryActions({ category, onDelete }: CategoryActionsProps) {
  const { openModal } = useModal();

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => openModal('editCategory', { category })}>
        Edit
      </Button>
      <Button variant="destructive" size="sm" onClick={() => onDelete(category.id)}>
        Delete
      </Button>
    </div>
  );
}
