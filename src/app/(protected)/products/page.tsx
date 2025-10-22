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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("/api/products");
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

  const {
    data: productList = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({ queryKey: ["products"], queryFn: fetchProducts });

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

  const handleEditProduct = async (
    id: string,
    productData: ProductFormValues
  ) => {
    await editMutation.mutateAsync({ id, data: productData });
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteMutation.mutateAsync(productId);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold animate-slide-in-up">
          Products
        </h1>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
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
        {isLoading || categoriesLoading ? (
          <ProductTableSkeleton />
        ) : isError || categoriesError ? (
          <div>Error loading products or categories.</div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {categoryList.map((category) => {
              const categoryProducts = sortedProducts.filter(
                (product) => product.categoryId === category.id
              );
              return (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="text-lg font-semibold">
                    {category.name} ({categoryProducts.length} products)
                  </AccordionTrigger>
                  <AccordionContent>
                    {categoryProducts.length > 0 ? (
                      <ProductTable columns={columns} data={categoryProducts} />
                    ) : (
                      <p className="text-muted-foreground">
                        No products in this category.
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
            {/* Products without category */}
            {(() => {
              const uncategorizedProducts = sortedProducts.filter(
                (product) => !product.categoryId
              );
              return uncategorizedProducts.length > 0 ? (
                <AccordionItem key="uncategorized" value="uncategorized">
                  <AccordionTrigger className="text-lg font-semibold">
                    Uncategorized ({uncategorizedProducts.length} products)
                  </AccordionTrigger>
                  <AccordionContent>
                    <ProductTable
                      columns={columns}
                      data={uncategorizedProducts}
                    />
                  </AccordionContent>
                </AccordionItem>
              ) : null;
            })()}
          </Accordion>
        )}
      </div>
    </>
  );
}
