import { useState, useCallback } from "react";
import { RevenueService } from "@/services/revenue.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";
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

  const refresh = useCallback(async () => {
    const data = await RevenueService.list();
    setRevenue(data);
  }, []);

  const fetch = useCallback(async () => {
    showLoading("Carregando receitas...");
    try {
      await refresh();
    } finally {
      hideLoading();
    }
  }, [refresh, showLoading, hideLoading]);

  const create = async (payload: CreateRevenueDTO) => {
    showLoading("Criando receita...");
    try {
      await RevenueService.create(payload);
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
      await RevenueService.update(payload);
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
    fetch,
    refresh,
    create,
    update,
    remove,
  };
};