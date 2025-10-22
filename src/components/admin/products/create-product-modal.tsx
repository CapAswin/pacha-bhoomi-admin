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
  onSave: (data: ProductFormValues, id?: string) => void;
}

export function CreateProductModal({ onSave }: CreateProductModalProps) {
  const { modal, closeModal } = useModal();

  if (modal?.type !== "createProduct" && modal?.type !== "editProduct") {
    return null;
  }

  const isEdit = modal.type === "editProduct";
  const product = isEdit ? (modal.data as { product: any }).product : null;

  const handleSave = (data: ProductFormValues) => {
    if (isEdit && product) {
      // For edit, pass the id separately
      onSave(data, product.id);
    } else {
      onSave(data);
    }
    closeModal();
  };

  return (
    <Dialog
      open={modal?.type === "createProduct" || modal?.type === "editProduct"}
      onOpenChange={closeModal}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Product" : "Create New Product"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm
          onSubmit={handleSave}
          onCancel={closeModal}
          initialData={isEdit ? product : undefined}
        />
      </DialogContent>
    </Dialog>
  );
}
