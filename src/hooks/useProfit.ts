import { useState, useCallback } from "react";
import { ProfitService } from "@/services/profit.service";
import { ProfitData } from "@/types/chart";

export function useProfit(initialProfit: ProfitData = {profit: [], labels: []}) {
  const [profit, setProfit] = useState<ProfitData>(initialProfit);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfit = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ProfitService.list();
      setProfit(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    profit,
    isLoading,
    fetchProfit
  };
};