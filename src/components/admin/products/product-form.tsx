'use client';
import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Bot } from 'lucide-react';
import { generateProductDescription, type GenerateProductDescriptionInput } from '@/ai/ai-product-description';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type ProductFormValues = {
    name: string;
    description: string;
    price: number;
    stock: number;
};

interface ProductFormProps {
    onSubmit: (values: ProductFormValues) => void;
    initialData?: Product | null;
    onClose: () => void;
}

export function ProductForm({ onSubmit, initialData, onClose }: ProductFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [price, setPrice] = useState(initialData?.price || 0);
    const [stock, setStock] = useState(initialData?.stock || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, description, price, stock });
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

    return (
        <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="flex flex-col space-y-1.5">
              <h2 className="text-lg font-semibold leading-none tracking-tight">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
              <p className="text-sm text-muted-foreground">Fill in the details for the product.</p>
            </div>

            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                    <label htmlFor="name">Name</label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="description">Description</label>
                    <div className="relative">
                        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Product Description" />
                        <Button type="button" className="absolute bottom-2 right-2 h-7 w-7" size="icon" onClick={handleGenerateDescription}>
                            <Bot className="h-4 w-4" />
                            <span className="sr-only">Generate with AI</span>
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="price">Price</label>
                        <Input id="price" type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value))} placeholder="Price" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="stock">Stock</label>
                        <Input id="stock" type="number" value={stock} onChange={e => setStock(parseInt(e.target.value, 10))} placeholder="Stock" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Save</Button>
            </div>
        </form>
    );
}
