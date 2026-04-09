import {
  IExpense,
  IExpenseApi,
  ExpenseCategory,
  ExpenseSource,
} from "../interfaces/expenseInterface";
import { IPaginatedApi } from "../interfaces/apiResponse";
import { expenseApiRepository } from "../apiRepository/expenseApiRepository";
import { mapExpense } from "../mappers/expenseMapper";

export interface ICreateExpensePayload {
  title: string;
  amount: number;
  category: ExpenseCategory;
  source: ExpenseSource;
  note: string;
  date: string;
}

const unwrapList = (data: unknown): IExpenseApi[] => {
  if (Array.isArray(data)) return data as IExpenseApi[];
  return ((data as IPaginatedApi<IExpenseApi[]>).results ?? []) as IExpenseApi[];
};

export const expenseService = {
  getExpenses: async (): Promise<IExpense[]> => {
    try {
      const res = await expenseApiRepository.list();
      return unwrapList(res.data).map(mapExpense);
    } catch (e) {
      console.error("Failed to get expenses:", e);
      return [];
    }
  },

  createExpense: async (payload: ICreateExpensePayload): Promise<IExpense> => {
    const res = await expenseApiRepository.create({
      title: payload.title,
      amount: payload.amount,
      category: payload.category,
      source: payload.source,
      note: payload.note,
      date: payload.date,
    });
    return mapExpense(res.data as IExpenseApi);
  },

  deleteExpense: async (id: string): Promise<void> => {
    await expenseApiRepository.delete(id);
  },

  getSummary: async () => {
    try {
      const res = await expenseApiRepository.summary();
      const data = res.data as {
        total: number;
        online: number;
        offline: number;
        by_category: Record<string, number>;
      };
      return {
        total: Number(data.total) || 0,
        online: Number(data.online) || 0,
        offline: Number(data.offline) || 0,
        byCategory: data.by_category ?? {},
      };
    } catch (e) {
      console.error("Failed to get expense summary:", e);
      return { total: 0, online: 0, offline: 0, byCategory: {} };
    }
  },
};
