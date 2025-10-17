'use client';

import { useModal } from '@/context/modal-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/types';

interface CategoryDeleteModalProps {
  onDelete: (id: string) => void;
}

export function CategoryDeleteModal({ onDelete }: CategoryDeleteModalProps) {
  const { modal, closeModal } = useModal();

  if (modal?.type !== 'confirmDeleteCategory') {
    return null;
  }

  const { category } = modal.data as { category: Category };

  const handleConfirm = () => {
    if (category && onDelete) {
      onDelete(category.id);
    }
    closeModal();
  };

  return (
    <Dialog open={modal.type === 'confirmDeleteCategory'} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            {`This action cannot be undone. This will permanently delete the category "${category?.name}".`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>Cancel</Button>
          <Button variant="destructive" onClick={handleConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
