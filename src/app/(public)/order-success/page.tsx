"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { orderService } from "@/domain/services/orderService";
import { IOrder } from "@/domain/interfaces/orderInterface";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const [order, setOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    if (id) orderService.retrieveOrder(id).then(setOrder);
  }, [id]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl border border-border/60 bg-card p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Order placed successfully!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Thank you for shopping with E‑Store and Accessories.
        </p>
        {order && (
          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium">
            <Package className="h-3 w-3" /> Order #{order.orderNumber}
          </div>
        )}
      </div>

      {order && (
        <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="text-lg font-semibold">Order details</h2>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <Detail label="Customer" value={order.customerName} />
            <Detail label="Phone" value={order.customerPhone} />
            <Detail label="Address" value={`${order.shippingAddress}, ${order.shippingCity}`} />
            <Detail label="Payment" value={order.paymentMethod.toUpperCase()} />
            <Detail label="Placed" value={formatDateTime(order.createdAt)} />
            <Detail label="Items" value={`${order.itemCount}`} />
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full">Continue shopping</Button>
        </Link>
        <Link href="/dashboard/orders" className="flex-1">
          <Button className="w-full">View all orders</Button>
        </Link>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
