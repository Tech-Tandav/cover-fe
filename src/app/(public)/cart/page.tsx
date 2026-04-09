"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { summary, updateQuantity, removeItem, clearCart } = useCart();

  if (summary.items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border/60 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-xl font-bold">Your cart is empty</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a few accessories to get started.
        </p>
        <Link href="/">
          <Button className="mt-6 gap-2">
            Continue shopping <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your cart</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-muted-foreground"
        >
          Clear all
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-3">
          {summary.items.map(({ product, color, size, quantity }) => {
            const variantLabel = [color, size].filter(Boolean).join(" · ") || null;
            return (
              <div
                key={`${product.id}::${color}::${size}`}
                className="flex gap-4 rounded-xl border border-border/60 bg-card p-4"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted/30"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {product.brand}
                    </div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="line-clamp-2 text-sm font-semibold hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    {variantLabel && (
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {variantLabel}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-border">
                      <button
                        onClick={() =>
                          updateQuantity(product.id, color, size, quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(product.id, color, size, quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">
                        {formatPrice(product.finalPrice * quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(product.id, color, size)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="h-fit space-y-4 rounded-xl border border-border/60 bg-card p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="space-y-2 text-sm">
            <Row label={`Subtotal (${summary.itemCount} items)`} value={formatPrice(summary.subtotal)} />
            <Row
              label="Shipping"
              value={summary.shipping === 0 ? "Free" : formatPrice(summary.shipping)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(summary.total)}</span>
          </div>
          {summary.subtotal < 5000 && (
            <p className="rounded-md bg-primary/10 p-2 text-xs text-primary">
              Add {formatPrice(5000 - summary.subtotal)} more for free shipping.
            </p>
          )}
          <Link href="/checkout" className="block">
            <Button size="lg" className="w-full gap-2">
              Proceed to checkout <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="ghost" className="w-full">
              Continue shopping
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
