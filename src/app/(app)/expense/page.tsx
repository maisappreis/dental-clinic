"use client";
import React, { useState, useEffect, useMemo } from "react";

import { ExpenseTable } from "@/app/(app)/expense/table";
import { Button } from "@/components/button/button";
import { Search } from "@/components/search/search";
import { Filter } from "@/components/filter/filter";
import { CreateUpdateModal } from "./modal/createUpdate";
import { DeleteModal } from "./modal/delete";
import { PaymentStatusModal } from "./modal/paymentStatus";

import { getCurrentYear, getCurrentMonth } from "@/utils/date";
import { applySearch } from "@/utils/search";
import { getNextMonth, getMonthAndYear } from "@/utils/date";
import { filterExpenseByMonthYearStatus } from "@/utils/filter";
import { months, years } from "@/constants/date";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useExpense } from "@/hooks/useExpense";
import { Expense } from "@/types/expense";
import { CreateExpenseDTO, UpdateExpenseDTO } from "@/types/expense";


export default function ExpensePage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [statusPayment, setStatusPayment] = useState<"Pago" | "À pagar" | "Todos">("Todos");
  const [search, setSearch] = useState<string>("");
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>(undefined);
  const [paymentStatusModalIsOpen, setPaymentStatusModalIsOpen] = useState<boolean>(false);
  const [createUpdateModalIsOpen, setCreateUpdateModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const { expenses, create, update, remove, fetchExpenses } = useExpense([]);

  const filteredData = useMemo(() => {
    if (!expenses.length) return [];

    let result = expenses;

    result = filterExpenseByMonthYearStatus(result, {
      month,
      year,
      status: statusPayment,
    });

    if (search) {
      result = applySearch(result, search);
    }

    return result;
  }, [expenses, month, year, statusPayment, search]);

  const searchData = (search: string) => {
    setSearch(search);
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

  const closeModal = () => {
    setPaymentStatusModalIsOpen(false);
    setCreateUpdateModalIsOpen(false);
    setDeleteModalIsOpen(false);
    setSelectedExpense(undefined);
  };

  const createExpense = async (data: CreateExpenseDTO) => {
    await create(data);
    closeModal();
  };

  const updateExpense = async (data: UpdateExpenseDTO) => {
    await update(data);
    closeModal();
  };

  const updateExpenseStatus = async (data: Expense) => {
    const response = await update({
      ...data,
      is_paid: !data.is_paid,
    });

    const isPaid = response.is_paid;
    const hasInstallments = response.installments !== "";

    if (isPaid && !hasInstallments) {
      await createNextMonthExpense(response);
    } 
    closeModal();
  };

  const createNextMonthExpense = async (expense: UpdateExpenseDTO) => {
    const nextDate = getNextMonth(expense.date);
    const [month, year] = getMonthAndYear(nextDate);

    await create({
      ...expense,
      date: nextDate,
      is_paid: false,
      month,
      year: Number(year),
    });

    closeModal();
  };

  const deleteExpense = async () => {
    if (!selectedExpense) return
    await remove(selectedExpense.id);
    closeModal();
  };

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

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
            onChange={setMonth}
          />
          <Filter
            value={year}
            options={years.map((item) => ({
              label: String(item),
              value: item,
            }))}
            onChange={setYear}
          />
          <Filter
            value={statusPayment}
            options={[
              { label: "À pagar", value: "À pagar" },
              { label: "Pago", value: "Pago" },
              { label: "Todos", value: "Todos" },
            ]}
            onChange={setStatusPayment}
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
  );
};