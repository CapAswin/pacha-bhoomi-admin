"use client";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/lib/types";
import { ProductTable } from "@/components/admin/products/product-table";
import { columns } from "@/components/admin/products/product-table-columns";
import { ProductTableSkeleton } from "@/components/admin/products/product-table-skeleton";

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("/api/products");
  if (!response.ok) throw new Error("Failed to fetch products");
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

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteMutation.mutateAsync(productId);
    }
  };

  return (
    <>
      <div className="border rounded-lg bg-card text-card-foreground shadow-sm glassmorphism mt-8">
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
              data={productList}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
        </div>
      </div>
    </>
  );
}
