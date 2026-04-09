import { instance } from "@/lib/axios/axiosInstance";

export interface IExpenseCreatePayload {
  title: string;
  amount: number;
  category: string;
  source: "online" | "offline";
  note: string;
  date: string;
}

export const expenseApiRepository = {
  list: () => instance.get("expenses/expenses/"),
  retrieve: (id: string | number) => instance.get(`expenses/expenses/${id}/`),
  create: (payload: IExpenseCreatePayload) =>
    instance.post("expenses/expenses/", payload),
  delete: (id: string | number) => instance.delete(`expenses/expenses/${id}/`),
  summary: () => instance.get("expenses/expenses/summary/"),
};
