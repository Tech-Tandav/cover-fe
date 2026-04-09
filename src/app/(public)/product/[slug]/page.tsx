"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { productService } from "@/domain/services/productService";
import { IProduct } from "@/domain/interfaces/productInterface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ChevronRight,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setSelectedColor(null);
    setSelectedSize(null);
    setQuantity(1);
    productService
      .retrieveProduct(params.slug)
      .then(async (p) => {
        setProduct(p);
        if (p) {
          const all = await productService.getProducts({
            categorySlug: p.categorySlug,
          });
          setRelated(all.filter((x) => x.id !== p.id).slice(0, 4));
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  const hasColors = (product?.colors.length ?? 0) > 0;
  const hasSizes = (product?.sizes.length ?? 0) > 0;
  const needsSelection = hasColors && (product?.colors.length ?? 0) > 1 || hasSizes;

  const canAddToCart = useMemo(() => {
    if (!product || !product.inStock) return false;
    if (hasColors && product.colors.length > 1 && !selectedColor) return false;
    if (hasSizes && !selectedSize) return false;
    return true;
  }, [product, hasColors, hasSizes, selectedColor, selectedSize]);

  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-2xl border border-dashed py-24 text-center">
        <p className="text-xl font-semibold">Product not found</p>
        <Link href="/">
          <Button className="mt-4">Back to home</Button>
        </Link>
      </div>
    );
  }

  const images = [
    { id: "main", imageUrl: product.imageUrl, alt: product.name },
    ...product.images,
  ];
  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    const color = selectedColor ?? product.colors[0] ?? "";
    const size = selectedSize ?? "";
    addItem(product, color, size, quantity);
    const variant = [color, size].filter(Boolean).join(" / ");
    toast.success(
      `Added ${quantity} × ${product.name}${variant ? ` (${variant})` : ""} to cart`
    );
  };

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/category/${product.categorySlug}`}
          className="hover:text-foreground"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      {/* Main */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
            <Image
              src={images[activeImage].imageUrl}
              alt={images[activeImage].alt}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
            {discountPct > 0 && (
              <Badge variant="destructive" className="absolute left-4 top-4">
                -{discountPct}% OFF
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                  i === activeImage
                    ? "border-primary"
                    : "border-transparent hover:border-border"
                }`}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.alt}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {product.brand}
              {product.isNew && (
                <Badge className="h-5">New</Badge>
              )}
            </div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">
              {formatPrice(product.finalPrice)}
            </span>
            {product.discountPrice && (
              <span className="pb-1 text-lg text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <Separator />

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Spec label="Brand" value={product.brand} />
            <Spec label="Material" value={product.material || "—"} />
            {product.colors.length === 1 && (
              <Spec label="Color" value={product.colors[0]} />
            )}
            <Spec
              label="Fits"
              value={product.variants.length ? product.variants.join(", ") : "—"}
            />
          </div>

          {/* Color picker */}
          {hasColors && product.colors.length > 1 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Color
                  </span>
                  {selectedColor && (
                    <span className="text-xs text-muted-foreground">
                      {selectedColor}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => {
                    const active = selectedColor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/60"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Size picker */}
          {hasSizes && (
            <>
              {!(hasColors && product.colors.length > 1) && <Separator />}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Size
                  </span>
                  {selectedSize && (
                    <span className="text-xs text-muted-foreground">
                      {selectedSize}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const active = selectedSize === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-12 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/60"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {needsSelection && <Separator />}

          {/* Stock indicator */}
          <p className="text-xs text-muted-foreground">
            {product.stock} in stock
          </p>

          {/* Quantity + add to cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={product.stock <= quantity}
                className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
            >
              <ShoppingBag className="h-4 w-4" />
              {!product.inStock
                ? "Out of stock"
                : hasColors && product.colors.length > 1 && !selectedColor
                  ? "Select a color"
                  : hasSizes && !selectedSize
                    ? "Select a size"
                    : "Add to cart"}
            </Button>
            <Button size="lg" variant="outline" aria-label="Wishlist">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, label: "Same‑day in Pokhara" },
              { icon: ShieldCheck, label: "Genuine product" },
              { icon: RotateCcw, label: "7‑day return" },
            ].map((t, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1 rounded-lg border border-border/60 p-3 text-center"
              >
                <t.icon className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-medium text-muted-foreground">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="pt-4">
          <div className="prose prose-sm max-w-none rounded-2xl border border-border/60 bg-card p-6 dark:prose-invert">
            <p>{product.description}</p>
          </div>
        </TabsContent>
        <TabsContent value="specs" className="pt-4">
          <div className="grid gap-3 rounded-2xl border border-border/60 bg-card p-6 sm:grid-cols-2">
            <Spec label="Brand" value={product.brand} />
            <Spec label="Category" value={product.category} />
            <Spec label="Material" value={product.material || "—"} />
            <Spec
              label="Colors"
              value={product.colors.length ? product.colors.join(", ") : "—"}
            />
            {product.sizes.length > 0 && (
              <Spec label="Sizes" value={product.sizes.join(", ")} />
            )}
            <Spec
              label="Fits"
              value={product.variants.length ? product.variants.join(", ") : "—"}
            />
            <Spec label="Stock" value={`${product.stock} units`} />
            <Spec label="Rating" value={`${product.rating} / 5`} />
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="pt-4">
          <div className="rounded-2xl border border-border/60 bg-card p-6 text-center text-sm text-muted-foreground">
            Reviews will appear here once your customers start leaving them.
          </div>
        </TabsContent>
      </Tabs>

      {/* Related */}
      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold">You may also like</h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group flex flex-col gap-2 overflow-hidden rounded-xl border border-border/60 bg-card p-3 transition-colors hover:border-primary/40"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted/30">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    sizes="(max-width:768px) 50vw, 25vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="text-xs text-muted-foreground">{p.brand}</div>
                <div className="line-clamp-1 text-sm font-semibold">{p.name}</div>
                <div className="text-sm font-bold">{formatPrice(p.finalPrice)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
