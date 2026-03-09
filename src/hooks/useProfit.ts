import { useState, useCallback } from "react";
import { ProfitService } from "@/services/profit.service";
import { useLoadingStore } from "@/stores/loading.store";
import { ProfitData } from "@/types/chart";

export function useProfit(initialProfit: ProfitData = {profit: [], labels: []}) {
  const [profit, setProfit] = useState<ProfitData>(initialProfit);

  const showLoading = useLoadingStore((s) => s.show);
  const hideLoading = useLoadingStore((s) => s.hide);

  const fetchProfit = useCallback(async () => {
    showLoading("Carregando lucros...");
    try {
      const data = await ProfitService.list();
      setProfit(data);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  return {
    profit,
    fetchProfit
  };
};