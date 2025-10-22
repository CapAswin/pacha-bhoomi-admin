'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, Product } from '@/lib/types';

// Modal type definitions
export type ModalType =
  | { type: 'createProduct'; data?: Product }
  | { type: 'editProduct'; data: { product: Product } }
  | { type: 'confirmDeleteProduct'; data: { product: Product } }
  | { type: 'createCategory'; data?: Category }
  | { type: 'editCategory'; data: { category: Category } }
  | { type: 'confirmDeleteCategory'; data: { category: Category } }
  | null;

type ModalTypeNonNull = Exclude<ModalType, null>;
type OpenModal = (type: ModalTypeNonNull['type'], data?: any) => void;

// Context type
interface ModalContextType {
  modal: ModalType;
  openModal: OpenModal;
  closeModal: () => void;
}

// Create context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

// Modal provider
export function ModalProvider({ children }: ModalProviderProps) {
  const [modal, setModal] = useState<ModalType>(null);

  const openModal: OpenModal = (type, data) => {
    setModal({ type, data });
  };

  const closeModal = () => setModal(null);

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}
