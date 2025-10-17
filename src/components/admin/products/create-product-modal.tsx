'use client';

import React from 'react';
import { useModal } from '@/context/modal-context';
import { ProductForm, ProductFormValues } from './product-form';

interface CreateProductModalProps {
  onSave: (data: ProductFormValues) => void;
}

export function CreateProductModal({ onSave }: CreateProductModalProps) {
  const { modal, closeModal } = useModal();

  if (modal !== 'createProduct') {
    return null;
  }

  const handleSave = (data: ProductFormValues) => {
    onSave(data);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Create New Product</h2>
        
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <ProductForm onSubmit={handleSave} onCancel={closeModal} />
      </div>
    </div>
  );
}
