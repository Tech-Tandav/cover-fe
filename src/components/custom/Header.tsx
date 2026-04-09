"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  User,
  LogOut,
  Search,
  ShoppingBag,
  LayoutDashboard,
  Menu,
  Zap,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "@/lib/cart/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/category/mobile-covers", label: "Covers" },
  { href: "/category/screen-protectors", label: "Protectors" },
  { href: "/category/chargers", label: "Chargers" },
  { href: "/category/earbuds", label: "Audio" },
  { href: "/category/smart-watches", label: "Watches" },
];

export function Header() {
  const { data: session, status } = useSession();
  const { summary } = useCart();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const isAuthenticated = !!session;
  const isOwner = session?.user?.role === "owner";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  if (status === "loading") return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      {/* Top utility strip */}
      <div className="hidden border-b border-border/40 bg-muted/30 md:block">
        <div className="container mx-auto flex h-8 items-center justify-between px-4 text-xs text-muted-foreground">
          <span>Naya Bazaar, Pokhara · Nepal</span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-primary" />
            Free shipping on orders over Rs. 5,000
          </span>
        </div>
      </div>

      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-left">E‑Store & Accessories</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1 px-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm">
            <Zap className="h-4 w-4" />
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="text-base">E‑Store</span>
            <span className="text-[10px] font-normal text-muted-foreground">
              & Accessories
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 md:block lg:max-w-md"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, brands, models…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/50 border-border/50 focus-visible:bg-background"
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {summary.itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {summary.itemCount}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-transparent"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="font-semibold">{session.user.name}</span>
                  <span className="text-xs font-normal capitalize text-muted-foreground">
                    {session.user.role}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    <ShoppingBag className="mr-2 h-4 w-4" /> My Orders
                  </Link>
                </DropdownMenuItem>
                {isOwner && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
