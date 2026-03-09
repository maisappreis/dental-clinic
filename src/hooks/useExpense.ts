import { useState, useCallback } from "react";
import { ExpenseService } from "@/services/expense.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";
import { capitalizeFirstLetter } from "@/utils/utils";
import { sortByDate } from "@/utils/sort";
import { getMonthAndYear } from "@/utils/date";
import {
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO,
} from "@/types/expense";

export function useExpense(initialExpense: Expense[] = []) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpense);
  const [isLoading, setIsLoading] = useState(true);

  const alert = useAlertStore.getState();
  const showLoading = useLoadingStore((s) => s.show);
  const hideLoading = useLoadingStore((s) => s.hide);

  const refresh = useCallback(async () => {
    const data = await ExpenseService.list();
    setExpenses(sortByDate(data, "asc"));
  }, []);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      await refresh();
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const create = async (payload: CreateExpenseDTO) => {
    showLoading("Criando despesa...");
    try {
      const [month, year] = getMonthAndYear(payload.date);

      await ExpenseService.create({
        ...payload,
        month,
        year: parseInt(year),
        name: capitalizeFirstLetter(payload.name),
      });
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
      const [month, year] = getMonthAndYear(payload.date);

      const updatedExpense = await ExpenseService.update({
        ...payload,
        month,
        year: parseInt(year),
        name: capitalizeFirstLetter(payload.name),
      });

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
    isLoading,
    fetchExpenses,
    refresh,
    create,
    update,
    remove,
  };
};