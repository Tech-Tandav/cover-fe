"use client";

import { IProduct } from "@/domain/interfaces/productInterface";
import { ProductCard } from "@/components/custom/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame } from "lucide-react";

export function HotSale({
  products,
  loading,
}: {
  products: IProduct[];
  loading: boolean;
}) {
  if (!loading && products.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-destructive">
            <Flame className="h-4 w-4" />
            Limited deals
          </div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Hot Sale
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Grab these deals before they&apos;re gone.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-3/4 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
