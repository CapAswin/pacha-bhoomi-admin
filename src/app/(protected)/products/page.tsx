"use client";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, Category } from "@/lib/types";
import { ProductTable } from "@/components/admin/products/product-table";
import { createColumns } from "@/components/admin/products/product-table-columns";
import { ProductTableSkeleton } from "@/components/admin/products/product-table-skeleton";
import { ProductFormValues } from "@/components/admin/products/product-form";
import { CreateProductModal } from "@/components/admin/products/create-product-modal";
import { ProductDeleteModal } from "@/components/admin/products/product-delete-modal";
import { SelectField } from "@/components/ui/select-field";
import { Button } from "@/components/ui/button";
import { useModal } from "@/context/modal-context";
import { showToast } from "@/lib/toast";

async function fetchProducts(categoryId?: string): Promise<Product[]> {
  const url =
    categoryId && categoryId !== "all"
      ? `/api/products?categoryId=${categoryId}`
      : "/api/products";
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}

async function addProduct(
  newProduct: ProductFormValues,
  pendingFiles?: (File | null)[]
): Promise<Product> {
  let productData = { ...newProduct };

  // Upload pending files first
  if (pendingFiles && pendingFiles.length > 0) {
    const uploadedUrls: string[] = [];
    for (const file of pendingFiles) {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("tempUpload", "true");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          uploadedUrls.push(uploadResult.imageUrl);
        }
      }
    }

    // Replace blob URLs with uploaded URLs
    productData.images = productData.images.map((img, index) =>
      img.startsWith("blob:") ? uploadedUrls[index] || img : img
    );
  }

  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("Failed to add product");
  return response.json();
}

async function editProduct(updatedProduct: {
  id: string;
  data: ProductFormValues;
  pendingFiles?: (File | null)[];
}): Promise<Product> {
  const response = await fetch(`/api/products/${updatedProduct.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedProduct.data),
  });
  if (!response.ok) throw new Error("Failed to edit product");

  const result = await response.json();

  // Upload any new pending files after successful update
  if (updatedProduct.pendingFiles && updatedProduct.pendingFiles.length > 0) {
    const uploadPromises = updatedProduct.pendingFiles.map(
      async (file, index) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("productId", updatedProduct.id);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        return uploadResult.success ? uploadResult.imageUrl : null;
      }
    );

    const uploadedUrls = await Promise.all(uploadPromises);
    const finalImages = uploadedUrls.filter((url) => url !== null);

    if (finalImages.length > 0) {
      // Update product with final image URLs, removing blob URLs
      const updatedImages = updatedProduct.data.images.map((img, idx) =>
        img.startsWith("blob:") ? finalImages.shift() || img : img
      );

      await fetch(`/api/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedProduct.data,
          images: updatedImages,
        }),
      });
    }
  }

  return result;
}

async function deleteProduct(productId: string): Promise<void> {
  const response = await fetch(`/api/products/${productId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete product");
}

async function bulkDeleteProducts(ids: string[]): Promise<void> {
  const response = await fetch("/api/products/bulk-delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) throw new Error("Failed to delete products");
}

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] =
    React.useState<string>("all");
  const { openModal } = useModal();

  const {
    data: productList = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["products", selectedCategoryId],
    queryFn: () => fetchProducts(selectedCategoryId),
  });

  const {
    data: categoryList = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const sortedProducts = React.useMemo(() => {
    if (!Array.isArray(productList)) return [];
    return [...productList].sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [productList]);

  const addMutation = useMutation({
    mutationFn: ({
      productData,
      pendingFiles,
    }: {
      productData: ProductFormValues;
      pendingFiles?: (File | null)[];
    }) => addProduct(productData, pendingFiles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast.success("Product added successfully!");
    },
    onError: () => {
      showToast.error("Failed to add product. Please try again.");
    },
  });

  const editMutation = useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast.success("Product updated successfully!");
    },
    onError: () => {
      showToast.error("Failed to update product. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast.success("Product deleted successfully!");
    },
    onError: () => {
      showToast.error("Failed to delete product. Please try again.");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast.success("Products deleted successfully!");
    },
    onError: () => {
      showToast.error("Failed to delete products. Please try again.");
    },
  });

  const handleAddProduct = async (
    productData: ProductFormValues,
    pendingFiles?: (File | null)[],
    id?: string
  ) => {
    if (id) {
      // Edit mode
      await editMutation.mutateAsync({ id, data: productData, pendingFiles });
    } else {
      // Create mode
      await addMutation.mutateAsync({ productData, pendingFiles });
    }
  };

  const handleEditProduct = async (
    id: string,
    productData: ProductFormValues
  ) => {
    await editMutation.mutateAsync({ id, data: productData });
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteMutation.mutateAsync(productId);
  };

  const handleBulkDeleteProducts = async (ids: string[]) => {
    await bulkDeleteMutation.mutateAsync(ids);
  };

  const columns = createColumns({
    onBulkDelete: handleBulkDeleteProducts,
  });

  const categoryOptions = [
    { id: "all", name: "All Categories" },
    ...categoryList,
  ];

  return (
    <>
      <div className="flex flex-1 flex-col gap-2 p-2 lg:gap-4 lg:p-4 bg-background overflow-auto">
        <CreateProductModal onSave={handleAddProduct} />
        <ProductDeleteModal onDelete={handleBulkDeleteProducts} />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Products</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your products.
            </p>
          </div>
          <Button onClick={() => openModal("createProduct")}>
            Create Product
          </Button>
        </div>
        <div className="w-full max-w-sm">
          <SelectField
            options={categoryOptions}
            value={selectedCategoryId}
            onChange={setSelectedCategoryId}
            placeholder="Filter by category"
          />
        </div>
        {isLoading || categoriesLoading ? (
          <ProductTableSkeleton />
        ) : isError || categoriesError ? (
          <div>Error loading products or categories.</div>
        ) : (
          <ProductTable columns={columns} data={sortedProducts} />
        )}
      </div>
    </>
  );
}
