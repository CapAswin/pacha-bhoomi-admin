"use client";

import React, { useState, useEffect } from "react";
import { Product, Category } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string | undefined;
};

interface ProductFormProps {
  onSubmit: (values: ProductFormValues) => void;
  initialData?: Product | null;
  onCancel?: () => void;
}

export function ProductForm({
  onSubmit,
  initialData,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price || 0);
  const [stock, setStock] = useState(initialData?.stock || 0);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId ? String(initialData.categoryId) : undefined
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [tempProductId, setTempProductId] = useState<string>("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      price,
      stock,
      images,
      categoryId: categoryId || "",
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageInput = () => {
    setImages([...images, ""]);
  };

  const removeImageInput = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Generate a temporary product ID for new products
    let productId = initialData?.id;
    if (!productId) {
      if (!tempProductId) {
        const newTempId = Date.now().toString();
        setTempProductId(newTempId);
        productId = newTempId;
      } else {
        productId = tempProductId;
      }
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", productId);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setImages([...images, result.imageUrl]);
      } else {
        console.error("Upload failed:", result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      // Clear the input value to allow re-uploading the same file
      event.target.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="category">Category</label>
          <SelectField
            value={categoryId || ""}
            options={categories}
            onChange={(value) => setCategoryId(value || undefined)}
            placeholder="Select a category"
          />
        </div>
        <div className="space-y-2">
          <label>Product Images</label>
          {images.map((image, index) => (
            <div key={index} className="flex items-center gap-2">
              {image.startsWith("/uploads/") ? (
                <div className="flex items-center gap-2 flex-1">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="h-10 w-10 object-cover rounded"
                  />
                  <span
                    className="text-sm text-gray-600 flex-1 truncate"
                    title={image.split("/").pop()}
                  >
                    {image.split("/").pop()?.substring(0, 20)}...
                  </span>
                </div>
              ) : (
                <Input
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="Image URL"
                  className="flex-1"
                />
              )}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeImageInput(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={addImageInput}
              disabled={isUploading}
            >
              Add Image URL
            </Button>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <Button type="button" variant="outline" disabled={isUploading}>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="description">Description</label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product Description"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="price">Price</label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              placeholder="Price"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="stock">Stock</label>
            <Input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value, 10))}
              placeholder="Stock"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {initialData ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
