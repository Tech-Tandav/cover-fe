"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IProduct } from "@/domain/interfaces/productInterface";
import { Star, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart/CartContext";
import { toast } from "sonner";

export function ProductCard({ product }: { product: IProduct }) {
  const { addItem } = useCart();
  const router = useRouter();

  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const needsSelection = product.colors.length > 1 || product.sizes.length > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (needsSelection) {
      router.push(`/product/${product.slug}`);
      return;
    }
    addItem(product, product.colors[0] ?? "", "", 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <Badge className="bg-primary/90 text-primary-foreground shadow">New</Badge>
          )}
          {discountPct > 0 && (
            <Badge variant="destructive" className="shadow">
              -{discountPct}%
            </Badge>
          )}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <Badge variant="secondary">Out of stock</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium uppercase tracking-wider">{product.brand}</span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          {product.name}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col">
            <span className="text-base font-bold">{formatPrice(product.finalPrice)}</span>
            {product.discountPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <Button
            size="icon"
            variant="default"
            onClick={handleAdd}
            disabled={!product.inStock}
            className="h-9 w-9 shrink-0 rounded-lg"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
