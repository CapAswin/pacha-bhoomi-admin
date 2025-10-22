"use client";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, Category } from "@/lib/types";
import { ProductTable } from "@/components/admin/products/product-table";
import { columns } from "@/components/admin/products/product-table-columns";
import { ProductTableSkeleton } from "@/components/admin/products/product-table-skeleton";
import { ProductFormValues } from "@/components/admin/products/product-form";
import { CreateProductModal } from "@/components/admin/products/create-product-modal";
import { ProductDeleteModal } from "@/components/admin/products/product-delete-modal";
import { SelectField } from "@/components/ui/select-field";

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

async function addProduct(newProduct: ProductFormValues): Promise<Product> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });
  if (!response.ok) throw new Error("Failed to add product");
  return response.json();
}

async function editProduct(updatedProduct: {
  id: string;
  data: ProductFormValues;
}): Promise<Product> {
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
  const [selectedCategoryId, setSelectedCategoryId] =
    React.useState<string>("all");

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
    console.log("Products data:", productList);
    console.log("First product createdAt:", productList[0]?.createdAt);
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

  const handleAddProduct = async (
    productData: ProductFormValues,
    id?: string
  ) => {
    if (id) {
      // Edit mode
      await editMutation.mutateAsync({ id, data: productData });
    } else {
      // Create mode
      await addMutation.mutateAsync(productData);
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

  const categoryOptions = [
    { id: "all", name: "All Categories" },
    ...categoryList,
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold animate-slide-in-up">
          Products
        </h1>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background overflow-auto">
        <CreateProductModal onSave={handleAddProduct} />
        <ProductDeleteModal onDelete={handleDeleteProduct} />
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Products</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your products.
            </p>
          </div>
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
