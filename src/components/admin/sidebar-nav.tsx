"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  TicketPercent,
  Settings,
  Mountain,
  TestTube,
  PanelLeft,
} from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/products", icon: Package, label: "Products" },
  { href: "/categories", icon: TestTube, label: "Categories" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/promotions", icon: TicketPercent, label: "Promotions" },
];

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function SidebarNav() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Simulate loading for navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        className={cn(
          "relative h-screen bg-card text-card-foreground border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-32" />
              </div>
            )}
            <Skeleton className="h-8 w-8" />
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2">
                <Skeleton className="h-5 w-5" />
                {!isCollapsed && <Skeleton className="h-4 w-20" />}
              </div>
            ))}
          </nav>
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="h-5 w-5" />
              {!isCollapsed && <Skeleton className="h-4 w-16" />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-screen bg-card text-card-foreground border-r transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-headline text-lg"
            >
              <Mountain className="h-6 w-6 text-primary" />
              <span>Pacha Bhoomi</span>
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-accent"
          >
            <PanelLeft className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </button>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname.startsWith(item.href) && "bg-primary/10 text-primary",
                isCollapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.label}</span>}
              {isCollapsed && <span className="sr-only">{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname.startsWith("/settings") && "bg-primary/10 text-primary",
              isCollapsed && "justify-center"
            )}
          >
            <Settings className="h-5 w-5" />
            {!isCollapsed && <span>Settings</span>}
            {isCollapsed && <span className="sr-only">Settings</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}
