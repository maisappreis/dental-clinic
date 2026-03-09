import { useState, useCallback } from "react";
import { ExpenseService } from "@/services/expense.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";
import { prepareDataForSubmission } from "@/utils/utils";
import { sortByDate } from "@/utils/sort";
import {
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO,
} from "@/types/expense";

export function useExpense(initialExpense: Expense[] = []) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpense);

  const alert = useAlertStore.getState();
  const showLoading = useLoadingStore((s) => s.show);
  const hideLoading = useLoadingStore((s) => s.hide);

  const refresh = useCallback(async () => {
    const data = await ExpenseService.list();
    setExpenses(sortByDate(data, "asc"));
  }, []);

  const fetchExpenses = useCallback(async () => {
    showLoading("Carregando despesas...");
    try {
      await refresh();
    } finally {
      hideLoading();
    }
  }, [refresh, showLoading, hideLoading]);

  const create = async (payload: CreateExpenseDTO) => {
    showLoading("Criando despesa...");
    try {
      const formatedPayload = prepareDataForSubmission(payload);

      await ExpenseService.create(formatedPayload);
      await refresh();

      alert.show({
        message: "Despesa criada com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      alert.show({
        message: "Erro ao criar despesa.",
        variant: "error",
      });
    } finally {
      hideLoading();
    }
  };

  const update = async (payload: UpdateExpenseDTO) => {
    showLoading("Atualizando despesa...");
    try {
      const formatedPayload = prepareDataForSubmission(payload);

      const updatedExpense = await ExpenseService.update(formatedPayload);
      await refresh();

      alert.show({
        message: "Despesa atualizada com sucesso!",
        variant: "success",
      });
      
      return updatedExpense;
    } catch (error) {
      console.error(error);
      alert.show({
        message: "Erro ao atualizar despesa.",
        variant: "error",
      });
    } finally {
      hideLoading();
    }
  };

  const remove = async (id: number) => {
    showLoading("Excluindo despesa...");
    try {
      await ExpenseService.remove(id);
      await refresh();

      alert.show({
        message: "Despesa excluida com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      alert.show({
        message: "Erro ao excluir despesa.",
        variant: "error",
      });
    } finally {
      hideLoading();
    }
  };

  return {
    expenses,
    fetchExpenses,
    refresh,
    create,
    update,
    remove,
  };
};