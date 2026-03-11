import { http } from "@/api/http";
import { apiURL } from "@/api/base";
import { Dashboard } from "@/types/chart";

export const DashboardService = {
  async list(): Promise<Dashboard> {
    const { data } = await http.get(`${apiURL()}/dashboard_charts/`);
    return data;
  }
};