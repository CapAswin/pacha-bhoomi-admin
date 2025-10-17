'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProductModal({ isOpen, onClose }: CreateProductModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Create New Product</h2>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
            <Input id="name" placeholder="Enter product name" className="mt-1" />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
            <Input id="price" type="number" placeholder="0.00" className="mt-1" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <Textarea id="description" placeholder="Enter product description" className="mt-1" />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">
              Save Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
