'use client';

import { useModal } from '@/context/modal-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';

interface ProductDeleteModalProps {
  onDelete: (id: string) => void;
}

export function ProductDeleteModal({ onDelete }: ProductDeleteModalProps) {
  const { modal, closeModal } = useModal();

  if (modal?.type !== 'confirmDeleteProduct') {
    return null;
  }

  const { product } = modal.data as { product: Product };

  const handleConfirm = () => {
    if (product && onDelete) {
      onDelete(product.id);
    }
    closeModal();
  };

  return (
    <Dialog open={modal.type === 'confirmDeleteProduct'} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            {`This action cannot be undone. This will permanently delete the product "${product?.name}".`}
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
