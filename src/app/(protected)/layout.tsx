"use client";

import type { PropsWithChildren } from "react";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { Header } from "@/components/admin/header";
import { Providers } from "@/components/providers";
import { PageLoading } from "@/components/ui/page-loading";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Show loading when navigating to a new page
    setIsPageLoading(true);

    // Simulate page loading time - increased to make it more visible
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800); // Increased from 300ms to 800ms

    return () => clearTimeout(timer);
  }, [pathname]);

  // Determine loading type based on pathname
  const getLoadingType = () => {
    if (pathname === "/dashboard") return "dashboard";
    if (
      pathname.includes("/products") ||
      pathname.includes("/promotions") ||
      pathname.includes("/categories") ||
      pathname.includes("/orders") ||
      pathname.includes("/customers")
    )
      return "table";
    return "generic";
  };

  return (
    <Providers>
      <div className="flex min-h-screen w-full">
        <SidebarNav />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {isPageLoading ? (
              <PageLoading type={getLoadingType()} showSpinner={true} />
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </Providers>
  );
}
