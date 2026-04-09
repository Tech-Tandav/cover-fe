"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { orderService } from "@/domain/services/orderService";
import { IOrder, OrderStatus } from "@/domain/interfaces/orderInterface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDateTime, cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { toast } from "sonner";

const STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  processing: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  shipped: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  delivered: "bg-green-500/15 text-green-700 dark:text-green-400",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-400",
};

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

  const load = () => {
    setLoading(true);
    orderService
      .getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    await orderService.updateOrderStatus(id, status);
    toast.success(`Order updated to ${status}`);
    load();
  };

  const filtered = orders.filter((o) =>
    statusFilter === "all" ? true : o.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track customer orders.
          </p>
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    No orders match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">
                      {o.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{o.customerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {o.customerPhone}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(o.createdAt)}
                    </TableCell>
                    <TableCell>{o.itemCount}</TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(o.total)}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-[10px]", STATUS_COLORS[o.status])}>
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <OrderDetailDrawer
                        order={o}
                        onStatusChange={handleStatusUpdate}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function OrderDetailDrawer({
  order,
  onStatusChange,
}: {
  order: IOrder;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost">
          <Eye className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order {order.orderNumber}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-5 px-1">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </div>
            <Select
              defaultValue={order.status}
              onValueChange={(v) =>
                onStatusChange(order.id, v as OrderStatus)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Customer
            </div>
            <div className="rounded-lg border border-border/60 p-3 text-sm">
              <div className="font-medium">{order.customerName}</div>
              <div className="text-muted-foreground">{order.customerPhone}</div>
              <div className="text-muted-foreground">{order.customerEmail}</div>
              <div className="mt-1 text-muted-foreground">
                {order.shippingAddress}, {order.shippingCity}
              </div>
              <div className="mt-1 capitalize text-muted-foreground">
                Payment: {order.paymentMethod}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Items
            </div>
            <div className="space-y-2">
              {order.items.map((it) => (
                <div
                  key={it.id}
                  className="flex gap-3 rounded-lg border border-border/60 p-3"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted/30">
                    <Image
                      src={it.productImage}
                      alt={it.productName}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="line-clamp-2 text-sm font-medium">
                      {it.productName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Qty {it.quantity} × {formatPrice(it.unitPrice)}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatPrice(it.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
