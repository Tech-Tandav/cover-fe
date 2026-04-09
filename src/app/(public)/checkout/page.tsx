"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutSchema, TCheckoutSchema } from "@/domain/schema/CheckoutSchema";
import { useCart } from "@/lib/cart/CartContext";
import { orderService } from "@/domain/services/orderService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { Banknote, Smartphone, CreditCard, CheckCircle2 } from "lucide-react";

const PAYMENT_OPTIONS = [
  { value: "cod", label: "Cash on Delivery", icon: Banknote },
  { value: "esewa", label: "eSewa", icon: Smartphone },
  { value: "khalti", label: "Khalti", icon: Smartphone },
  { value: "bank", label: "Bank Transfer", icon: CreditCard },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { summary, clearCart } = useCart();

  const form = useForm<TCheckoutSchema>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      shippingAddress: "",
      shippingCity: "Pokhara",
      paymentMethod: "cod",
    },
  });

  useEffect(() => {
    if (summary.items.length === 0) {
      router.replace("/cart");
    }
  }, [summary.items.length, router]);

  if (summary.items.length === 0) return null;

  const onSubmit = async (data: TCheckoutSchema) => {
    try {
      const order = await orderService.createOrder({
        ...data,
        items: summary.items,
        shipping: summary.shipping,
      });
      clearCart();
      toast.success(`Order ${order.orderNumber} placed successfully!`);
      router.push(`/order-success?id=${order.id}`);
    } catch (e) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const paymentMethod = form.watch("paymentMethod");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-sm text-muted-foreground">
          Review your order and complete payment.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-6 lg:grid-cols-[1fr_400px]"
        >
          <div className="space-y-6">
            {/* Contact */}
            <Section title="Contact information">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ramesh Thapa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="98XXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Section>

            {/* Shipping */}
            <Section title="Shipping address">
              <FormField
                control={form.control}
                name="shippingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Street, ward, landmark" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Section>

            {/* Payment */}
            <Section title="Payment method">
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = paymentMethod === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() =>
                        form.setValue("paymentMethod", opt.value)
                      }
                      className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-border/60 hover:border-border"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{opt.label}</div>
                      </div>
                      {selected && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </Section>
          </div>

          {/* Order summary sidebar */}
          <aside className="h-fit space-y-4 rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="max-h-64 space-y-3 overflow-y-auto">
              {summary.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted/30">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="line-clamp-2 text-xs font-semibold">
                      {product.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Qty: {quantity}
                    </span>
                  </div>
                  <span className="text-xs font-bold">
                    {formatPrice(product.finalPrice * quantity)}
                  </span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(summary.subtotal)} />
              <Row
                label="Shipping"
                value={summary.shipping === 0 ? "Free" : formatPrice(summary.shipping)}
              />
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(summary.total)}</span>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Placing order…" : "Place order"}
            </Button>
            <Link href="/cart" className="block text-center text-xs text-muted-foreground hover:text-foreground">
              Back to cart
            </Link>
          </aside>
        </form>
      </Form>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
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
