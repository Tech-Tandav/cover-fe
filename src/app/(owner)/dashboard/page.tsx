"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { orderService } from "@/domain/services/orderService";
import { expenseService } from "@/domain/services/expenseService";
import { IOrder } from "@/domain/interfaces/orderInterface";
import { IExpense } from "@/domain/interfaces/expenseInterface";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDateTime, cn } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  Wallet,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  processing: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  shipped: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  delivered: "bg-green-500/15 text-green-700 dark:text-green-400",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-400",
};

export default function DashboardOverview() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([orderService.getOrders(), expenseService.getExpenses()])
      .then(([o, e]) => {
        setOrders(o);
        setExpenses(e);
      })
      .finally(() => setLoading(false));
  }, []);

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = revenue - totalExpense;

  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(today));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const todayExpense = expenses
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  // last 7 days data for sparkline-ish bars
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    const dayRev = orders
      .filter((o) => o.createdAt.startsWith(iso) && o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0);
    const dayExp = expenses
      .filter((e) => e.date === iso)
      .reduce((s, e) => s + e.amount, 0);
    return { date: iso, revenue: dayRev, expense: dayExp };
  });
  const maxBar = Math.max(...last7.flatMap((d) => [d.revenue, d.expense]), 1);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of your store's performance.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          icon={TrendingUp}
          label="Total revenue"
          value={formatPrice(revenue)}
          delta={`+${formatPrice(todayRevenue)} today`}
          positive
        />
        <KpiCard
          icon={ShoppingBag}
          label="Total orders"
          value={`${orders.length}`}
          delta={`${todayOrders.length} today`}
          positive
        />
        <KpiCard
          icon={Wallet}
          label="Total expenses"
          value={formatPrice(totalExpense)}
          delta={`${formatPrice(todayExpense)} today`}
          positive={false}
        />
        <KpiCard
          icon={Package}
          label="Net profit"
          value={formatPrice(profit)}
          delta={profit >= 0 ? "Healthy" : "Losses"}
          positive={profit >= 0}
        />
      </div>

      {/* Chart + pending */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Last 7 days</h2>
              <p className="text-xs text-muted-foreground">Revenue vs expenses</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" /> Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-destructive" /> Expense
              </span>
            </div>
          </div>
          <div className="flex h-56 items-end justify-between gap-3">
            {last7.map((d) => {
              const day = new Date(d.date).toLocaleDateString("en-US", {
                weekday: "short",
              });
              return (
                <div
                  key={d.date}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex h-44 w-full items-end justify-center gap-1">
                    <div
                      className="w-1/3 rounded-t bg-primary transition-all"
                      style={{
                        height: `${(d.revenue / maxBar) * 100}%`,
                        minHeight: d.revenue > 0 ? "4px" : "0",
                      }}
                      title={formatPrice(d.revenue)}
                    />
                    <div
                      className="w-1/3 rounded-t bg-destructive/80 transition-all"
                      style={{
                        height: `${(d.expense / maxBar) * 100}%`,
                        minHeight: d.expense > 0 ? "4px" : "0",
                      }}
                      title={formatPrice(d.expense)}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">Pending orders</h2>
            <p className="text-xs text-muted-foreground">
              {pendingCount} need your attention
            </p>
          </div>
          <div className="space-y-2">
            {orders
              .filter((o) => o.status === "pending" || o.status === "processing")
              .slice(0, 4)
              .map((o) => (
                <Link
                  key={o.id}
                  href={`/dashboard/orders`}
                  className="block rounded-lg border border-border/60 p-3 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{o.orderNumber}</span>
                    <Badge className={cn("text-[10px]", STATUS_COLORS[o.status])}>
                      {o.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {o.customerName} · {formatPrice(o.total)}
                  </div>
                </Link>
              ))}
            {pendingCount === 0 && (
              <p className="rounded-lg border border-dashed border-border/60 py-6 text-center text-xs text-muted-foreground">
                No pending orders. You're all caught up!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent orders + expenses */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <Link
              href="/dashboard/orders"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {orders.slice(0, 5).map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-lg border border-border/60 p-3"
              >
                <div>
                  <div className="text-xs font-semibold">{o.orderNumber}</div>
                  <div className="text-xs text-muted-foreground">
                    {o.customerName} · {formatDateTime(o.createdAt)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{formatPrice(o.total)}</div>
                  <Badge className={cn("text-[10px]", STATUS_COLORS[o.status])}>
                    {o.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent expenses</h2>
            <Link
              href="/dashboard/expenses"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {expenses.slice(0, 5).map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between rounded-lg border border-border/60 p-3"
              >
                <div>
                  <div className="line-clamp-1 text-xs font-semibold">{e.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {e.category} · {e.source} · {e.date}
                  </div>
                </div>
                <div className="text-sm font-bold text-destructive">
                  -{formatPrice(e.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  positive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={cn(
            "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            positive
              ? "bg-green-500/15 text-green-700 dark:text-green-400"
              : "bg-red-500/15 text-red-700 dark:text-red-400"
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
        </span>
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
      <div className="text-xs text-muted-foreground">{delta}</div>
    </div>
  );
}
