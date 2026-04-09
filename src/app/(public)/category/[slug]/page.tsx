"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ProductCard } from "@/components/custom/ProductCard";
import {
  FilterPanel,
  IFilterOptions,
} from "@/components/custom/FilterPanel";
import { productService, IProductFilter } from "@/domain/services/productService";
import { categoryService } from "@/domain/services/categoryService";
import { IProduct } from "@/domain/interfaces/productInterface";
import { ICategory } from "@/domain/interfaces/categoryInterface";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, Smartphone, X } from "lucide-react";
import {
  DeviceFilterDialog,
  IDeviceSelection,
} from "@/components/custom/DeviceFilterDialog";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [category, setCategory] = useState<ICategory | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [options, setOptions] = useState<IFilterOptions | null>(null);
  const [filter, setFilter] = useState<IProductFilter>({ categorySlug: slug });
  const [loading, setLoading] = useState(true);
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [deviceLabel, setDeviceLabel] = useState<string | null>(null);

  // Load category meta + filter options once. Auto-open the device picker so
  // the customer narrows down by brand/model/variant before browsing.
  useEffect(() => {
    setLoading(true);
    Promise.all([
      categoryService.retrieveCategory(slug),
      productService.getFilterOptions(slug),
    ]).then(([cat, opts]) => {
      setCategory(cat);
      setOptions(opts);
      setFilter({ categorySlug: slug });
      setDeviceLabel(null);
      setDeviceDialogOpen(true);
    });
  }, [slug]);

  const handleDeviceApply = (selection: IDeviceSelection) => {
    setFilter({
      categorySlug: slug,
      brands: [selection.brand.name],
      variants: [selection.variant.name],
    });
    setDeviceLabel(
      `${selection.brand.name} ${selection.model.name} ${selection.variant.name}`
    );
  };

  // Re-fetch products when filter changes
  useEffect(() => {
    setLoading(true);
    productService
      .getProducts(filter)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [filter]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    (["brands", "variants", "materials"] as const).forEach((k) => {
      if ((filter[k] as string[] | undefined)?.length) n++;
    });
    if (filter.inStockOnly) n++;
    if (filter.minPrice != null || filter.maxPrice != null) n++;
    return n;
  }, [filter]);

  const handleReset = () => setFilter({ categorySlug: slug });

  return (
    <div className="space-y-6">
      <DeviceFilterDialog
        open={deviceDialogOpen}
        onOpenChange={setDeviceDialogOpen}
        categorySlug={slug}
        onApply={handleDeviceApply}
      />

      {/* Header */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-6 md:p-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          Category
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
          {category?.name ?? "Loading…"}
        </h1>
        {category?.description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {category.description}
          </p>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setDeviceDialogOpen(true)}
          >
            <Smartphone className="h-4 w-4" />
            {deviceLabel ?? "Pick your device"}
          </Button>

          {/* Filter trigger (works on all sizes — modal popover) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge
                    variant="default"
                    className="ml-1 h-5 min-w-5 px-1.5 text-[10px]"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[340px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Refine results</SheetTitle>
              </SheetHeader>
              <div className="mt-4 h-[calc(100vh-100px)]">
                {options && (
                  <FilterPanel
                    options={options}
                    filter={filter}
                    onChange={setFilter}
                    onReset={handleReset}
                  />
                )}
              </div>
            </SheetContent>
          </Sheet>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1 text-muted-foreground"
            >
              <X className="h-3 w-3" /> Clear
            </Button>
          )}

          <span className="hidden text-sm text-muted-foreground sm:inline">
            {loading ? "Loading…" : `${products.length} products`}
          </span>
        </div>

        <Select
          value={filter.sortBy ?? "newest"}
          onValueChange={(v) =>
            setFilter({ ...filter, sortBy: v as IProductFilter["sortBy"] })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
            <SelectItem value="rating">Top rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && options && (
        <div className="flex flex-wrap gap-1.5">
          {(["brands", "variants", "materials"] as const).flatMap(
            (key) =>
              ((filter[key] as string[] | undefined) ?? []).map((value) => (
                <Badge
                  key={`${key}-${value}`}
                  variant="secondary"
                  className="gap-1 px-2 py-1"
                >
                  {value}
                  <button
                    onClick={() => {
                      const next = (filter[key] as string[]).filter(
                        (v) => v !== value
                      );
                      setFilter({
                        ...filter,
                        [key]: next.length ? next : undefined,
                      });
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-3/4 rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 py-20 text-center">
          <p className="text-lg font-semibold">No products match your filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try removing some filters to see more results.
          </p>
          <Button onClick={handleReset} variant="outline" className="mt-4">
            Reset filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
