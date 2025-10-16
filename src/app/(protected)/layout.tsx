
'use client';

import type { PropsWithChildren } from 'react';
import { SidebarNav } from '@/components/admin/sidebar-nav';
import { Header } from '@/components/admin/header';
import { Providers } from '@/components/providers';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <div className="flex min-h-screen w-full">
        <SidebarNav />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
