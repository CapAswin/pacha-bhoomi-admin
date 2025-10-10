import type { PropsWithChildren } from 'react';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/admin/sidebar-nav';
import { Header } from '@/components/admin/header';

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <div className="flex flex-col min-h-screen w-full">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
