"use client";
import React, { useState, useEffect, useCallback } from "react";

import { ExpenseTable } from "@/app/pages/expense/table";
import { Button } from "@/components/button/button";
import { Loading } from "@/components/loading/loading";
import { Search } from "@/components/search/search";
import { Filter } from "@/components/filter/filter";
import { CreateUpdateModal } from "./modal/createUpdate";
import { DeleteModal } from "./modal/delete";
import { PaymentStatusModal } from "./modal/paymentStatus";

import { capitalize } from "@/utils/utils";
import { getCurrentYear, getCurrentMonth } from "@/utils/date";
import { applySearch } from "@/utils/filter";
import { getNextMonth, getMonthAndYear } from "@/utils/date";
import { apiURL, fetchExpenses, isAuthenticated, configureAxios } from '@/utils/api';
import { months, years } from "@/assets/data";

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAlertStore } from "@/stores/alert.store";
import { Expense, ExpenseData } from "@/types/expense";
import { CreateExpenseDTO, UpdateExpenseDTO, ExpenseFormData } from "@/types/expense";
import axios from "axios";

export default function ExpensePage({ expenses = [], setExpenses, loading }: ExpenseData) {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [statusPayment, setStatusPayment] = useState<string>("Todos");
  const [search, setSearch] = useState<string>("");
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentStatusModalIsOpen, setPaymentStatusModalIsOpen] = useState<boolean>(false);
  const [createUpdateModalIsOpen, setCreateUpdateModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const alert = useAlertStore.getState();

  const filterData = useCallback(({
    selectedMonth = month,
    selectedYear = year,
    selectedStatus = statusPayment
  }) => {
    setMonth(selectedMonth)
    setYear(selectedYear)
    setStatusPayment(selectedStatus);
    setSearch("");

    let isPaid = false;

    if (selectedStatus === "À pagar") isPaid = false;
    if (selectedStatus === "Pago") isPaid = true;

    if (expenses && expenses.length > 0) {
      const filtered = expenses.filter(item => {
        if (selectedMonth === "Todos os meses" && selectedYear === "Todos" && selectedStatus === "Todos") return true;
        if (selectedMonth === "Todos os meses" && selectedStatus === "Todos") return item.year.toString() === selectedYear;
        if (selectedMonth === "Todos os meses" && selectedYear === "Todos") return item.is_paid === isPaid;
        if (selectedYear === "Todos" && selectedStatus === "Todos") return item.month === selectedMonth;

        if (selectedMonth === "Todos os meses") return item.year.toString() === selectedYear && item.is_paid === isPaid;
        if (selectedYear === "Todos") return item.month === selectedMonth && item.is_paid === isPaid;
        if (selectedStatus === "Todos") return item.month === selectedMonth && item.year.toString() === selectedYear;
        return item.month === selectedMonth && item.year.toString() === selectedYear && item.is_paid === isPaid;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }

  }, [month, year, statusPayment, expenses]);

  const searchData = (search: string) => {
    setSearch(search);

    const filteredData = applySearch(expenses, search)
    setFilteredData(filteredData);
  }

  const closeModal = () => {
    setPaymentStatusModalIsOpen(false);
    setCreateUpdateModalIsOpen(false);
    setDeleteModalIsOpen(false);
    setSelectedExpense(undefined);
  };

  const changePaymentStatus = async () => {
    if (selectedExpense) await updateExpenseStatus(selectedExpense)
    setPaymentStatusModalIsOpen(false);
  };

  const openConfirmationModal = (expense: Expense): void => {
    setSelectedExpense(expense);
    setPaymentStatusModalIsOpen(true);
  };

   const openCreateModal = (): void =>  {
    setSelectedExpense(undefined);
    setCreateUpdateModalIsOpen(true);
  };

  const openUpdateModal = (expense: Expense): void => {
    setSelectedExpense(expense);
    setCreateUpdateModalIsOpen(true);
  };

  const openDeleteModal = (expense: Expense): void => {
    setSelectedExpense(expense);
    setDeleteModalIsOpen(true);
  };

  const prepareDataForSubmission = (data: ExpenseFormData) => {
    if (data.date) {
      const [month, year] = getMonthAndYear(data.date);
      return {
        ...data,
        month,
        year: parseInt(year),
        name: capitalize(data.name),
      };
    } else {
      return {
        ...data,
        name: capitalize(data.name),
      };
    }
  };

  const createExpense = async (expense: CreateExpenseDTO) => {
    setIsLoading(true);
    try {
      const preparedData = prepareDataForSubmission(expense);

      await axios.post(`${apiURL()}/expense/create/`, preparedData)

      alert.show({
        message: "Despesa criada com sucesso!",
        variant: "success",
      });
      const newExpense = await fetchExpenses();
      setExpenses(newExpense)
    } catch (error) {
      console.error('Erro ao criar despesa.', error)
      alert.show({
        message: "Erro ao criar despesa.",
        variant: "error",
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  };

  const updateExpense = async (expense: UpdateExpenseDTO) => {
    setIsLoading(true);
    try {
      const preparedData = prepareDataForSubmission(expense);

      await axios.patch(`${apiURL()}/expense/${preparedData.id}/`, preparedData)

      alert.show({
        message: "Despesa atualizada com sucesso!",
        variant: "success",
      });
      const newExpense = await fetchExpenses();
      setExpenses(newExpense)
    } catch (error) {
      console.error('Erro ao atualizar despesa.', error)

      alert.show({
        message: "Erro ao atualizar despesa.",
        variant: "error",
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  };

  const updateExpenseStatus = async (row: Expense) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`${apiURL()}/expense/${row.id}/`, {
        is_paid: !row.is_paid
      })
      alert.show({
        message: "Despesa atualizada com sucesso!",
        variant: "success",
      });

      const isPaid = response.data.is_paid;
      const hasInstallments = response.data.installments !== "";

      if (isPaid && !hasInstallments) {
        await createNextMonthExpense(row);
      } else {
        const newExpense = await fetchExpenses();
        setExpenses(newExpense)
      }
    } catch (error) {
      console.error('Erro ao atualizar despesa.', error)
      alert.show({
        message: "Erro ao atualizar despesa.",
        variant: "error",
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  };

  const createNextMonthExpense = async (row: Expense) => {
    setIsLoading(true);
    try {
      const selectedExpenseClone = {...row}
      const nextMonthDate = getNextMonth(selectedExpenseClone.date);
      const [month, year] = getMonthAndYear(nextMonthDate);

      selectedExpenseClone.date = nextMonthDate;
      selectedExpenseClone.is_paid = false;
      selectedExpenseClone.month = month;
      selectedExpenseClone.year = parseInt(year);

      await axios.post(`${apiURL()}/expense/create/`, selectedExpenseClone)

      alert.show({
        message: "Despesa do mês seguinte criada com sucesso!",
        variant: "success",
      });

      const newExpense = await fetchExpenses();
      setExpenses(newExpense);
    } catch (error) {
      console.error('Erro ao criar despesa do mês seguinte.', error)

      alert.show({
        message: "Erro ao criar despesa do mês seguinte.",
        variant: "error",
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  };

  const deleteExpense = async () => {
    setIsLoading(true);
    try {
      if (selectedExpense && selectedExpense.id) {
        await axios.delete(`${apiURL()}/expense/${selectedExpense.id}/`)

        alert.show({
          message: "Despesa excluída com sucesso!",
          variant: "success",
        });
        const newExpense = await fetchExpenses();
        setExpenses(newExpense)
      }
    } catch (error) {
      console.error('Erro ao excluir despesa.', error)

      alert.show({
        message: "Erro ao excluir despesa.",
        variant: "error",
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isAuthenticated();
    configureAxios();
  }, []);

  useEffect(() => {
    if (!loading && expenses && expenses.length > 0) {
      expenses.sort((a, b) => {
        const dateA: Date = new Date(a.date);
        const dateB: Date = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      filterData({ selectedMonth: month, selectedYear: year, selectedStatus: statusPayment });
    }
  }, [expenses, loading, filterData, month, year, statusPayment]);

  if (isLoading) {
    return (
      <Loading
        label="Salvando..."
      />
    );
  }

  return (
    <div className="content">
      <div className="flex flex-column justify-between" style={{ marginBottom: 15 }}>
        <Button
          label="Nova Despesa"
          icon={faPlus}
          onClick={openCreateModal}
        />
        <div className="flex justify-end">
          <Filter
            value={month}
            options={months.map((item) => ({
              label: item,
              value: item,
            }))}
            onChange={(value) => {
              setMonth(value);
              filterData({ selectedMonth: value });
            }}
          />
          <Filter
            value={year}
            options={years.map((item) => ({
              label: String(item),
              value: item,
            }))}
            onChange={(value) => {
              setYear(value);
              filterData({ selectedYear: value });
            }}
          />
          <Filter
            value={statusPayment}
            options={[
              { label: "À pagar", value: "À pagar" },
              { label: "Pago", value: "Pago" },
              { label: "Todos", value: "Todos" },
            ]}
            onChange={(value) => {
              setStatusPayment(value);
              filterData({ selectedStatus: value });
            }}
          />
          <Search value={search} onValueChange={searchData} />
        </div>
      </div>
      <ExpenseTable
        data={filteredData}
        actions={{
          onConfirmStatus: openConfirmationModal,
          onOpenUpdate: openUpdateModal,
          onOpenDelete: openDeleteModal,
        }}
      />

      <CreateUpdateModal
        open={createUpdateModalIsOpen}
        expense={selectedExpense}
        onClose={closeModal}
        onCreate={createExpense}
        onUpdate={updateExpense}
      />

      <DeleteModal
        open={deleteModalIsOpen}
        expense={selectedExpense}
        onClose={closeModal}
        onDelete={deleteExpense}
      />

      <PaymentStatusModal
        open={paymentStatusModalIsOpen}
        expense={selectedExpense}
        onClose={closeModal}
        onChange={changePaymentStatus}
      />
    </div>
  )
};