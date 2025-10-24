"use client";

import { useModal } from "@/context/modal-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";

interface ProductDeleteModalProps {
  onDelete: (ids: string[]) => void;
}

export function ProductDeleteModal({ onDelete }: ProductDeleteModalProps) {
  const { modal, closeModal } = useModal();

  if (
    modal?.type !== "confirmDeleteProduct" &&
    modal?.type !== "confirmDeleteProducts"
  ) {
    return null;
  }

  const isBulkDelete = modal.type === "confirmDeleteProducts";
  const { product, products, count } = modal.data as {
    product?: Product;
    products?: Product[];
    count?: number;
  };

  const handleConfirm = () => {
    if (isBulkDelete && products) {
      const ids = products.map((prod) => prod.id);
      onDelete(ids);
    } else if (product) {
      onDelete([product.id]);
    }
    closeModal();
  };

  const title = isBulkDelete
    ? "Delete Multiple Products"
    : "Are you absolutely sure?";
  const description = isBulkDelete
    ? `This action cannot be undone. This will permanently delete ${
        count || products?.length
      } selected products.`
    : `This action cannot be undone. This will permanently delete the product "${product?.name}".`;

  return (
    <Dialog
      open={
        modal.type === "confirmDeleteProduct" ||
        modal.type === "confirmDeleteProducts"
      }
      onOpenChange={closeModal}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
