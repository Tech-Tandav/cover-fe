"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { productService } from "@/domain/services/productService";
import { IProduct } from "@/domain/interfaces/productInterface";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice, cn } from "@/lib/utils";
import { Plus, Search, Pencil, X } from "lucide-react";

const ALL = "all";
type StockFilter = "all" | "in" | "low" | "out";

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState<string>(ALL);
  const [brandSlug, setBrandSlug] = useState<string>(ALL);
  const [stockFilter, setStockFilter] = useState<StockFilter>(ALL);

  useEffect(() => {
    productService
      .getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => map.set(p.categorySlug, p.category));
    return Array.from(map, ([slug, name]) => ({ slug, name })).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [products]);

  const brandOptions = useMemo(() => {
    const map = new Map<string, string>();
    products
      .filter((p) => categorySlug === ALL || p.categorySlug === categorySlug)
      .forEach((p) => map.set(p.brandSlug, p.brand));
    return Array.from(map, ([slug, name]) => ({ slug, name })).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [products, categorySlug]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) {
        return false;
      }
      if (categorySlug !== ALL && p.categorySlug !== categorySlug) return false;
      if (brandSlug !== ALL && p.brandSlug !== brandSlug) return false;
      if (stockFilter === "in" && p.stock <= 0) return false;
      if (stockFilter === "low" && (p.stock <= 0 || p.stock >= 10)) return false;
      if (stockFilter === "out" && p.stock > 0) return false;
      return true;
    });
  }, [products, search, categorySlug, brandSlug, stockFilter]);

  const hasActiveFilters =
    search !== "" ||
    categorySlug !== ALL ||
    brandSlug !== ALL ||
    stockFilter !== ALL;

  const resetFilters = () => {
    setSearch("");
    setCategorySlug(ALL);
    setBrandSlug(ALL);
    setStockFilter(ALL);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your inventory ({products.length} items).
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/products/new">
            <Plus className="h-4 w-4" /> Add product
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={categorySlug}
          onValueChange={(v) => {
            setCategorySlug(v);
            setBrandSlug(ALL);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All categories</SelectItem>
            {categoryOptions.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={brandSlug} onValueChange={setBrandSlug}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All brands</SelectItem>
            {brandOptions.map((b) => (
              <SelectItem key={b.slug} value={b.slug}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={stockFilter}
          onValueChange={(v) => setStockFilter(v as StockFilter)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All stock</SelectItem>
            <SelectItem value="in">In stock</SelectItem>
            <SelectItem value="low">Low (&lt; 10)</SelectItem>
            <SelectItem value="out">Out of stock</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="gap-1 text-muted-foreground"
          >
            <X className="h-4 w-4" /> Clear
          </Button>
        )}

        <div className="ml-auto text-sm text-muted-foreground">
          {filtered.length} of {products.length}
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted/30">
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="line-clamp-1 text-sm font-medium">
                          {p.name}
                        </div>
                        <div className="line-clamp-1 text-xs text-muted-foreground">
                          {p.material || p.colors?.join(", ") || "—"}
                          {p.variants.length > 0 && (
                            <> · {p.variants.slice(0, 3).join(", ")}{p.variants.length > 3 ? "…" : ""}</>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{p.brand}</TableCell>
                  <TableCell className="text-sm">{p.category}</TableCell>
                  <TableCell>
                    <div className="text-sm font-semibold">
                      {formatPrice(p.finalPrice)}
                    </div>
                    {p.discountPrice && (
                      <div className="text-xs text-muted-foreground line-through">
                        {formatPrice(p.price)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        p.stock < 10 ? "text-destructive" : "text-foreground"
                      )}
                    >
                      {p.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    {p.inStock ? (
                      <Badge className="bg-green-500/15 text-green-700 dark:text-green-400">
                        In stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Out</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
