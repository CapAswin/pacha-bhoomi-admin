'use client';

import { useModal } from '@/context/modal-context';
import { CategoryForm } from '@/components/admin/categories/category-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Category } from '@/lib/types';

interface CategoryModalProps {
  onCreate: (values: Omit<Category, 'id'>) => void;
  onEdit: (id: string, values: Omit<Category, 'id'>) => void;
}

export function CategoryModal({ onCreate, onEdit }: CategoryModalProps) {
  const { modal, closeModal, data } = useModal();

  const isCreateModal = modal === 'createCategory';
  const isEditModal = modal === 'editCategory';

  const handleSubmit = (values: Omit<Category, 'id'>) => {
    if (isEditModal && data?.category) {
      onEdit(data.category.id, values);
    } else {
      onCreate(values);
    }
    closeModal();
  };

  return (
    <Dialog open={isCreateModal || isEditModal} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditModal ? 'Edit Category' : 'Create Category'}</DialogTitle>
        </DialogHeader>
        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          initialData={isEditModal ? data.category : null}
        />
      </DialogContent>
    </Dialog>
  );
}
