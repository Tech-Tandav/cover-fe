import { IExpense, IExpenseApi } from "../interfaces/expenseInterface";

const toNum = (v: number | string | null | undefined): number => {
  if (v === null || v === undefined || v === "") return 0;
  return typeof v === "number" ? v : Number(v);
};

export const mapExpense = (api: IExpenseApi): IExpense => ({
  id: String(api.id),
  title: api.title,
  amount: toNum(api.amount),
  category: api.category,
  source: api.source,
  note: api.note ?? "",
  date: api.date,
  createdAt: api.created_at,
});
