'use client';

import React, { useState, useEffect } from "react";
import { Product, Category } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Bot, X } from "lucide-react";
import {
  generateProductDescription,
  type GenerateProductDescriptionInput,
} from "@/ai/ai-product-description";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
};

interface ProductFormProps {
  onSubmit: (values: ProductFormValues) => void;
  initialData?: Product | null;
  onCancel?: () => void;
}

export function ProductForm({ onSubmit, initialData, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price || 0);
  const [stock, setStock] = useState(initialData?.stock || 0);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [categories, setCategories] = useState<Category[]>([]);

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
    onSubmit({ name, description, price, stock, images, categoryId });
  };

  async function handleGenerateDescription() {
    try {
      const input: GenerateProductDescriptionInput = {
        attributes: "organic, non-gmo, sustainably-sourced",
        keywords: "turmeric, spice, health, antioxidant",
        style: "Informative and appealing",
      };
      const result = await generateProductDescription(input);
      if (result.description) {
        setDescription(result.description);
      }
    } catch (error) {
      console.error("Failed to generate description:", error);
    }
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageInput = () => {
    setImages([...images, '']);
  };

  const removeImageInput = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
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
          <Select onValueChange={setCategoryId} defaultValue={categoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label>Image URLs</label>
          {images.map((image, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="Image URL"
              />
              <Button type="button" variant="outline" size="icon" onClick={() => removeImageInput(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addImageInput}
          >
            Add Image URL
          </Button>
        </div>
        <div className="space-y-2">
          <label htmlFor="description">Description</label>
          <div className="relative">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product Description"
            />
            <Button
              type="button"
              className="absolute bottom-2 right-2 h-7 w-7"
              size="icon"
              onClick={handleGenerateDescription}
            >
              <Bot className="h-4 w-4" />
              <span className="sr-only">Generate with AI</span>
            </Button>
          </div>
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
        <Button type="submit">{initialData ? 'Save Changes' : 'Create Product'}</Button>
      </div>
    </form>
  );
}
