import { http } from "@/api/http";
import { apiURL } from "@/api/base";
import { ProfitData } from "@/types/chart";

export const ProfitService = {
  async list(): Promise<ProfitData> {
    const { data } = await http.get(`${apiURL()}/profit_list/`);
    return data;
  }
};