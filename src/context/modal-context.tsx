'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ModalType = 'createProduct' | 'editProduct' | 'createCategory' | 'editCategory' | null;

interface ModalContextType {
  modal: ModalType;
  openModal: (modal: ModalType, data?: any) => void;
  closeModal: () => void;
  data?: any;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modal, setModal] = useState<ModalType>(null);
  const [data, setData] = useState<any>();

  const openModal = (modalType: ModalType, data?: any) => {
    setModal(modalType);
    if (data) {
      setData(data);
    }
  };

  const closeModal = () => {
    setModal(null);
    setData(undefined);
  };

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal, data }}>
      {children}
    </ModalContext.Provider>
  );
}
