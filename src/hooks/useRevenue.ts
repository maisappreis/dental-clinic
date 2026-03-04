import { useState, useCallback } from "react";
import { RevenueService } from "@/services/revenue.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";
import { sortByDate } from "@/utils/sort";
import { capitalizeFirstLetter } from '@/utils/utils';
import {
  Revenue,
  CreateRevenueDTO,
  UpdateRevenueDTO,
} from "@/types/revenue";

export function useRevenue(initialRevenue: Revenue[] = []) {
  const [revenue, setRevenue] = useState<Revenue[]>(initialRevenue);

  const alert = useAlertStore.getState();
  const showLoading = useLoadingStore((s) => s.show);
  const hideLoading = useLoadingStore((s) => s.hide);

  const refresh = useCallback(async (): Promise<Revenue[]> => {
    const data = await RevenueService.list();
    const sorted = sortByDate(data, "desc");
    setRevenue(sorted);
    return sorted;
  }, []);

  const fetchRevenue = useCallback(async () => {
    showLoading("Carregando receitas...");
    try {
      return await refresh();
    } finally {
      hideLoading();
    }
  }, [refresh, showLoading, hideLoading]);

  const create = async (payload: CreateRevenueDTO) => {
    showLoading("Criando receita...");
    try {
      const formatedPayload = {
        ...payload,
        name: capitalizeFirstLetter(payload.name),
      };

      await RevenueService.create(formatedPayload);
      await refresh();

      alert.show({
        message: "Receita criada com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      alert.show({
        message: "Erro ao criar receita.",
        variant: "error",
      });
    } finally {
      hideLoading();
    }
  };

  const update = async (payload: UpdateRevenueDTO) => {
    showLoading("Atualizando receita...");
    try {
      const formatedPayload = {
        ...payload,
        name: capitalizeFirstLetter(payload.name),
      };

      await RevenueService.update(formatedPayload);
      await refresh();

      alert.show({
        message: "Receita atualizada com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      alert.show({
        message: "Erro ao atualizar receita.",
        variant: "error",
      });
    } finally {
      hideLoading();
    }
  };

  const remove = async (id: number) => {
    showLoading("Excluindo receita...");
    try {
      await RevenueService.remove(id);
      await refresh();

      alert.show({
        message: "Receita excluida com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      alert.show({
        message: "Erro ao excluir receita.",
        variant: "error",
      });
    } finally {
      hideLoading();
    }
  };

  return {
    revenue,
    fetchRevenue,
    refresh,
    create,
    update,
    remove,
  };
};