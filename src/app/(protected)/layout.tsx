
'use client';

import type { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/admin/sidebar-nav';
import { Header } from '@/components/admin/header';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProtectedLayout({ children }: PropsWithChildren) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-lg p-4">
          <Skeleton className="h-14 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-[80vh] w-20" />
            <Skeleton className="h-[80vh] flex-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <div className="flex flex-col min-h-screen w-full">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background animate-fade-in">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
