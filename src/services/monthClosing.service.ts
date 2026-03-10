import { http } from "@/api/http";
import { apiURL } from "@/api/base";
import {
  MonthClosing,
  UpdateNetValuesPayload,
  UpdateMonthClosingDTO,
  UpdateNetValuesResponse
} from "@/types/monthClosing";

export const MonthClosingService = {
  async list(year: number): Promise<MonthClosing[]> {
    const { data } = await http.get(`${apiURL()}/month_closing/?year=${year}`);
    return data;
  },

  async update(payload: UpdateMonthClosingDTO): Promise<MonthClosing> {
    const { data } = await http.put(`${apiURL()}/month_closing/${payload.id}/`, payload);
    return data;
  },
  
  async updateNetValues(payload: UpdateNetValuesPayload): Promise<UpdateNetValuesResponse> {
     const { data } = await http.put(`${apiURL()}/update_net_values/`, payload);
     return data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${apiURL()}/month_closing/${id}/`);
  },
};