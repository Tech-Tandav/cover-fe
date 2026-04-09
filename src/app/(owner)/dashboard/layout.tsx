"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/expenses", label: "Expenses", icon: Wallet },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-card/30 lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border/60 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold">E‑Store</span>
            <span className="text-[10px] text-muted-foreground">Admin</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/60 p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to store
          </Link>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold">E‑Store Admin</span>
          <Link
            href="/"
            className="ml-auto text-xs text-muted-foreground hover:text-foreground"
          >
            ← Store
          </Link>
        </header>

        {/* Bottom nav for mobile */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-border/60 bg-background/95 backdrop-blur lg:hidden">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-4 pb-24 md:p-6 lg:p-8 lg:pb-8">{children}</main>
      </div>
    </div>
  );
}
