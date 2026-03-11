import { useState, useCallback } from "react";
import { DashboardService } from "@/services/dashboard.service";
import { Dashboard } from "@/types/chart";

export function useDashboard(initialData: Dashboard) {
  const [dataChart, setDataChart] = useState<Dashboard>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDataChart = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await DashboardService.list();
      setDataChart(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    dataChart,
    isLoading,
    fetchDataChart
  };
};