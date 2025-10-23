"use client";

import React, { useState, useEffect } from "react";
import { Product, Category } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, GripVertical } from "lucide-react";
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
  removedImages?: string[];
};

interface ProductFormProps {
  onSubmit: (values: ProductFormValues, pendingFiles?: (File | null)[]) => void;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<(File | null)[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload pending files after successful product creation
      await onSubmit(
        {
          name,
          description,
          price,
          stock,
          images,
          categoryId: categoryId || "",
          removedImages,
        },
        pendingFiles
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageInput = () => {
    if (images.length < 6) {
      setImages([...images, ""]);
    }
  };

  const removeImageInput = (index: number) => {
    const imageToRemove = images[index];
    const newImages = images.filter((_, i) => i !== index);
    const newPendingFiles = pendingFiles.filter((_, i) => i !== index);
    setImages(newImages);
    setPendingFiles(newPendingFiles);

    // If this is an existing image (not a blob URL), track it for deletion
    if (
      imageToRemove &&
      !imageToRemove.startsWith("blob:") &&
      imageToRemove.startsWith("/uploads/")
    ) {
      setRemovedImages([...removedImages, imageToRemove]);
    }

    // Clean up object URL if it's a blob URL
    if (imageToRemove?.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Prevent upload if already at limit
    if (images.length >= 6) {
      console.error("Maximum 6 images allowed per product.");
      return;
    }

    // Create object URL for instant preview
    const previewUrl = URL.createObjectURL(file);

    // Store file for later upload
    setPendingFiles([...pendingFiles, file]);
    setImages([...images, previewUrl]);

    event.target.value = "";
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
          <div className="max-h-48 overflow-y-auto border rounded-md p-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 rounded ${
                  draggedIndex === index
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                {image.startsWith("/uploads/") || image.startsWith("blob:") ? (
                  <div className="flex items-center gap-2 flex-1">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="h-10 w-10 object-cover rounded"
                    />
                    <span
                      className="text-sm text-gray-600 flex-1 truncate"
                      title={image.split("/").pop() || "Uploaded image"}
                    >
                      {index === 0 && (
                        <span className="text-green-600 font-medium mr-1">
                          (Primary)
                        </span>
                      )}
                      {image.startsWith("blob:")
                        ? "New image preview"
                        : image.split("/").pop()?.substring(0, 20) + "..."}
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
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={addImageInput}
              disabled={isUploading || images.length >= 6}
            >
              Add Image URL
            </Button>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading || images.length >= 6}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploading || images.length >= 6}
              >
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
        <Button type="submit" disabled={isUploading || isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {initialData ? "Saving..." : "Creating..."}
            </>
          ) : initialData ? (
            "Save Changes"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  );
}
