'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useModal } from '@/context/modal-context';
import { Product } from '@/lib/types';

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModal();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    openModal('editProduct', { product });
    setIsOpen(false);
  };

  const handleDelete = () => {
    openModal('confirmDeleteProduct', { product });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsOpen(!isOpen)}>
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem" onClick={(e) => { e.preventDefault(); handleEdit(); }}>
            Edit
          </a>
          <a href="#" className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem" onClick={(e) => { e.preventDefault(); handleDelete(); }}>
            Delete
          </a>
        </div>
      )}
    </div>
  );
}
