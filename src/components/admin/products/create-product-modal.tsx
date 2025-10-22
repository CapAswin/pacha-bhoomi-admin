"use client";

import React from "react";
import { useModal } from "@/context/modal-context";
import { ProductForm, ProductFormValues } from "./product-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateProductModalProps {
  onSave: (data: ProductFormValues) => void;
}

export function CreateProductModal({ onSave }: CreateProductModalProps) {
  const { modal, closeModal } = useModal();

  if (modal?.type !== "createProduct") {
    return null;
  }

  const handleSave = (data: ProductFormValues) => {
    onSave(data);
    closeModal();
  };

  return (
    <Dialog open={modal?.type === "createProduct"} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <ProductForm onSubmit={handleSave} onCancel={closeModal} />
      </DialogContent>
    </Dialog>
  );
}
