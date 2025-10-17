"use client";

import { useModal } from "@/context/modal-context";
import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types";

interface CategoryActionsProps {
  category: Category;
}

export function CategoryActions({ category }: CategoryActionsProps) {
  const { openModal } = useModal();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => openModal("editCategory", { category })}
      >
        Edit
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={() => openModal("confirmDeleteCategory", { category })}
      >
        Delete
      </Button>
    </div>
  );
}
