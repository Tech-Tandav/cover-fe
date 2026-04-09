import { z } from "zod";

export const ExpenseSchema = z.object({
  title: z.string().min(2, "Title is required"),
  amount: z.number({ message: "Amount is required" }).positive("Amount must be positive"),
  category: z.enum([
    "inventory",
    "rent",
    "utilities",
    "salary",
    "marketing",
    "transport",
    "supplies",
    "other",
  ]),
  source: z.enum(["online", "offline"]),
  note: z.string(),
  date: z.string().min(1, "Date is required"),
});

export type TExpenseSchema = z.infer<typeof ExpenseSchema>;
