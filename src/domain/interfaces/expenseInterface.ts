export type ExpenseCategory =
  | "inventory"
  | "rent"
  | "utilities"
  | "salary"
  | "marketing"
  | "transport"
  | "supplies"
  | "other";

export type ExpenseSource = "online" | "offline";

export interface IExpenseApi {
  id: number | string;
  title: string;
  amount: number | string;
  category: ExpenseCategory;
  source: ExpenseSource;
  note: string;
  date: string;
  created_at: string;
}

export interface IExpense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  source: ExpenseSource;
  note: string;
  date: string;
  createdAt: string;
}
