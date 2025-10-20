
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ModalProvider } from '@/context/modal-context';
import { LoadingProvider } from '@/context/loading-context';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
      <ModalProvider>{children}</ModalProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
}
