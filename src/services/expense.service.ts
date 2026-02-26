import { http } from "@/api/http";
import { apiURL } from "@/api/base";
import {
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO
} from "@/types/expense";

export const ExpenseService = {
  async list(): Promise<Expense[]> {
    const { data } = await http.get(`${apiURL()}/expense/`);
    return data;
  },

  async create(payload: CreateExpenseDTO): Promise<void> {
    const { data } = await http.post(`${apiURL()}/expense/create/`, payload);
    return data;
  },

  async update(payload: UpdateExpenseDTO): Promise<void> {
    const { data } = await http.patch(`${apiURL()}/expense/${payload.id}/`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${apiURL()}/expense/${id}/`);
  },
};