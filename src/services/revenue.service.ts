import { http } from "@/api/http";
import { apiURL } from "@/api/base";
import {
  Revenue,
  CreateRevenueDTO,
  UpdateRevenueDTO,
} from "@/types/revenue";

export const RevenueService = {
  async list(): Promise<Revenue[]> {
    const { data } = await http.get(`${apiURL()}/revenue/`);
    return data;
  },

  async create(payload: CreateRevenueDTO): Promise<void> {
    const { data } = await http.post(`${apiURL()}/revenue/create/`, payload);
    return data;
  },

  async update(payload: UpdateRevenueDTO): Promise<void> {
    const { data } = await http.patch(`${apiURL()}/revenue/${payload.id}/`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${apiURL()}/revenue/${id}/`);
  },
};