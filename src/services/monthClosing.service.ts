import { http } from "@/api/http";
import { apiURL } from "@/api/base";
import {
  MonthClosing,
  CreateMonthClosingDTO,
  UpdateMonthClosingDTO,
  UpdateNetValuesPayload
} from "@/types/monthClosing";

export const MonthClosingService = {
  async list(year: number): Promise<MonthClosing[]> {
    const { data } = await http.get(`${apiURL()}/month_closing/?year=${year}`);
    return data;
  },

  async create(payload: CreateMonthClosingDTO): Promise<MonthClosing> {
    const { data } = await http.post(`${apiURL()}/month_closing/create/`, payload);
    return data;
  },

  async update(payload: UpdateMonthClosingDTO): Promise<MonthClosing> {
    const { data } = await http.put(`${apiURL()}/month_closing/${payload.id}/`, payload);
    return data;
  },
  
  async updateNetValues(payload: UpdateNetValuesPayload[]): Promise<void> {
    await http.put(`${apiURL()}/update-net-values/`, payload);
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${apiURL()}/month_closing/${id}/`);
  },
};