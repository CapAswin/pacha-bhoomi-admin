'use client';
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/lib/types";
import { ProductTable } from "@/components/admin/products/product-table";
import { columns } from "@/components/admin/products/product-table-columns";
import { ProductTableSkeleton } from "@/components/admin/products/product-table-skeleton";
import { ProductFormValues } from "@/components/admin/products/product-form";
import { CreateProductModal } from "@/components/admin/products/create-product-modal";
import { ProductDeleteModal } from "@/components/admin/products/product-delete-modal";

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("/api/products");
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

async function addProduct(newProduct: ProductFormValues): Promise<Product> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });
  if (!response.ok) throw new Error("Failed to add product");
  return response.json();
}

async function editProduct(updatedProduct: { id: string, data: ProductFormValues }): Promise<Product> {
  const response = await fetch(`/api/products/${updatedProduct.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedProduct.data),
  });
  if (!response.ok) throw new Error("Failed to edit product");
  return response.json();
}

async function deleteProduct(productId: string): Promise<void> {
  const response = await fetch(`/api/products/${productId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete product");
}

export default function ProductsPage() {
  const queryClient = useQueryClient();

  const {
    data: productList = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({ queryKey: ["products"], queryFn: fetchProducts });

  const sortedProducts = React.useMemo(() => {
    if (!Array.isArray(productList)) return [];
  
    return [...productList].sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [productList]);

  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const editMutation = useMutation({
    mutationFn: editProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const handleAddProduct = async (productData: ProductFormValues) => {
    await addMutation.mutateAsync(productData);
  };

  const handleEditProduct = async (id: string, productData: ProductFormValues) => {
    await editMutation.mutateAsync({ id, data: productData });
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteMutation.mutateAsync(productId);
  };

  return (
    <>
     <CreateProductModal onSave={handleAddProduct} />
     <ProductDeleteModal onDelete={handleDeleteProduct} />
      <div className="border rounded-lg bg-card text-card-foreground shadow-sm glassmorphism mt-3">
        <div className="p-6">
          <h3 className="font-headline text-2xl font-semibold">Product List</h3>
          <p className="text-sm text-muted-foreground">
            Manage your products and view their sales performance.
          </p>
        </div>
        <div className="p-6 pt-0">
          {isLoading ? (
            <ProductTableSkeleton />
          ) : isError ? (
            <div>Error loading products.</div>
          ) : (
            <ProductTable
              columns={columns}
              data={sortedProducts}
            />
          )}
        </div>
      </div>
    </>
  );
}
