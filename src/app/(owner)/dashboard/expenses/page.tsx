"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExpenseSchema,
  TExpenseSchema,
} from "@/domain/schema/ExpenseSchema";
import { expenseService } from "@/domain/services/expenseService";
import { IExpense, ExpenseCategory } from "@/domain/interfaces/expenseInterface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { Plus, Trash2, Wifi, WifiOff, Wallet, TrendingDown } from "lucide-react";
import { toast } from "sonner";

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  inventory: "Inventory",
  rent: "Rent",
  utilities: "Utilities",
  salary: "Salary",
  marketing: "Marketing",
  transport: "Transport",
  supplies: "Supplies",
  other: "Other",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "online" | "offline">("all");

  const load = () => {
    setLoading(true);
    expenseService
      .getExpenses()
      .then(setExpenses)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string) => {
    await expenseService.deleteExpense(id);
    toast.success("Expense deleted");
    load();
  };

  const filtered = expenses.filter((e) =>
    tab === "all" ? true : e.source === tab
  );

  const today = new Date().toISOString().slice(0, 10);
  const totals = {
    all: expenses.reduce((s, e) => s + e.amount, 0),
    online: expenses
      .filter((e) => e.source === "online")
      .reduce((s, e) => s + e.amount, 0),
    offline: expenses
      .filter((e) => e.source === "offline")
      .reduce((s, e) => s + e.amount, 0),
    today: expenses
      .filter((e) => e.date === today)
      .reduce((s, e) => s + e.amount, 0),
  };

  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});
  const maxCat = Math.max(...Object.values(byCategory), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense tracker</h1>
          <p className="text-sm text-muted-foreground">
            Track every rupee — online payments and offline cash transactions.
          </p>
        </div>
        <AddExpenseSheet onSaved={load} />
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          icon={Wallet}
          label="Total spent"
          value={formatPrice(totals.all)}
          accent="bg-primary/10 text-primary"
        />
        <KpiCard
          icon={TrendingDown}
          label="Today"
          value={formatPrice(totals.today)}
          accent="bg-orange-500/10 text-orange-600 dark:text-orange-400"
        />
        <KpiCard
          icon={Wifi}
          label="Online"
          value={formatPrice(totals.online)}
          accent="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          icon={WifiOff}
          label="Offline (cash)"
          value={formatPrice(totals.offline)}
          accent="bg-green-500/10 text-green-600 dark:text-green-400"
        />
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <h2 className="text-lg font-semibold">By category</h2>
        <p className="text-xs text-muted-foreground">
          Where your money is going.
        </p>
        <div className="mt-4 space-y-3">
          {Object.entries(byCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, amt]) => (
              <div key={cat}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium capitalize">
                    {CATEGORY_LABELS[cat as ExpenseCategory]}
                  </span>
                  <span className="text-muted-foreground">
                    {formatPrice(amt)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-primary to-primary/70"
                    style={{ width: `${(amt / maxCat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="online">Online</TabsTrigger>
          <TabsTrigger value="offline">Offline</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          {loading ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center text-sm text-muted-foreground">
              No expenses yet. Add your first one above.
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      e.source === "online"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "bg-green-500/10 text-green-600 dark:text-green-400"
                    )}
                  >
                    {e.source === "online" ? (
                      <Wifi className="h-4 w-4" />
                    ) : (
                      <WifiOff className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{e.title}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {CATEGORY_LABELS[e.category]} · {formatDate(e.date)}
                      {e.note && ` · ${e.note}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-destructive">
                      -{formatPrice(e.amount)}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(e.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-5">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          accent
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function AddExpenseSheet({ onSaved }: { onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const form = useForm<TExpenseSchema>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      title: "",
      amount: 0,
      category: "other",
      source: "offline",
      note: "",
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const onSubmit = async (data: TExpenseSchema) => {
    await expenseService.createExpense(data);
    toast.success("Expense recorded");
    form.reset({
      title: "",
      amount: 0,
      category: "other",
      source: "offline",
      note: "",
      date: new Date().toISOString().slice(0, 10),
    });
    setOpen(false);
    onSaved();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add expense
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>New expense</SheetTitle>
          <SheetDescription>
            Track an online payment or an offline (cash) expense.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4 px-1"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Stock — Spigen cases" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (Rs.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        value={field.value === 0 ? "" : field.value}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? 0 : parseFloat(e.target.value)
                          )
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                          <SelectItem key={v} value={v}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline (cash)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saving…" : "Save expense"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
