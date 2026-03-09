import { useState, useCallback } from "react";
import { MonthClosingService } from "@/services/monthClosing.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";
import {
  MonthClosing,
  CreateMonthClosingDTO,
  UpdateMonthClosingDTO,
  UpdateNetValuesPayload
} from "@/types/monthClosing";

export function useMonthClosing(initialMonthClosing: MonthClosing[] = []) {
  const [monthClosing, setMonthClosing] = useState<MonthClosing[]>(initialMonthClosing);
  const [isLoading, setIsLoading] = useState(false);

  const alert = useAlertStore.getState();
  const showLoading = useLoadingStore((s) => s.show);
  const hideLoading = useLoadingStore((s) => s.hide);

  const refresh = useCallback(async (year: number) => {
    const data = await MonthClosingService.list(year);
    setMonthClosing(data);
  }, []);

  const fetchMonthClosing = useCallback(async (year: number) => {
    setIsLoading(true);
    try {
      await refresh(year);
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const create = async (payload: CreateMonthClosingDTO) => {
    showLoading('Salvando dados...');
    try {
      const response = await MonthClosingService.create(payload);

      alert.show({
        message: "Dados salvos com sucesso!",
        variant: "success",
      });

      return response;
    } catch (error) {
      console.error('Erro ao salvar os dados.', error)
      alert.show({
        message: "Erro ao salvar os dados.",
        variant: "error",
      });
    } finally {
      hideLoading();
    }
  };

  const update = async (payload: UpdateMonthClosingDTO) => {
    showLoading('Salvando dados...');
    try {
      const response = await MonthClosingService.update(payload);

      alert.show({
        message: "Dados salvos com sucesso!",
        variant: "success",
      });

      return response;
    } catch (error) {
      console.error('Erro ao salvar os dados.', error)

      alert.show({
        message: "Erro ao salvar os dados.",
        variant: "error",
      });
    } finally {
      hideLoading();
    }
  };

  const updateNetValues = async (payload: UpdateNetValuesPayload[]) => {
    showLoading("Atualizando valores líquidos...");
    try {
      await MonthClosingService.updateNetValues(payload);

      alert.show({
        message: "Valores líquidos atualizados com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error('Erro ao atualizar os valores líquidos.', error);

      alert.show({
        message: "Erro ao atualizar os valores líquidos.",
        variant: "error",
      });
    } finally {
      hideLoading();
    }
  };

  return {
    monthClosing,
    isLoading,
    fetchMonthClosing,
    create,
    update,
    updateNetValues
  };
};