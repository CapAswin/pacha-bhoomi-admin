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

interface PromotionDeleteModalProps {
  onDelete: (ids: string[]) => void;
}

export function PromotionDeleteModal({ onDelete }: PromotionDeleteModalProps) {
  const { modal, closeModal } = useModal();

  if (modal?.type !== "confirmDeletePromotions") {
    return null;
  }

  const { promotions, count } = modal.data as {
    promotions: any[];
    count: number;
  };

  const handleConfirm = () => {
    const ids = promotions.map((promo) => promo.id);
    onDelete(ids);
    closeModal();
  };

  const title = "Delete Multiple Promotions";
  const description = `This action cannot be undone. This will permanently delete ${
    count || promotions?.length
  } selected promotions.`;

  return (
    <Dialog
      open={modal.type === "confirmDeletePromotions"}
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
