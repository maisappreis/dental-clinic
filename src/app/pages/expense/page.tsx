"use client";
import React, { useState, useEffect, useCallback } from "react";

import { ExpenseTable } from "@/app/pages/expense/table";
import { Button } from "@/components/button/button";
import { Search } from "@/components/search/search";
import { Filter } from "@/components/filter/filter";
import { CreateUpdateModal } from "./modal/createUpdate";
import { DeleteModal } from "./modal/delete";
import { PaymentStatusModal } from "./modal/paymentStatus";

import { capitalizeFirstLetter } from "@/utils/utils";
import { getCurrentYear, getCurrentMonth } from "@/utils/date";
import { applySearch } from "@/utils/search";
import { getNextMonth, getMonthAndYear } from "@/utils/date";
import { months, years } from "@/constants/date";

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useExpense } from "@/hooks/useExpense";
import { Expense } from "@/types/expense";
import { CreateExpenseDTO, UpdateExpenseDTO, ExpenseFormData } from "@/types/expense";


export default function ExpensePage() {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [statusPayment, setStatusPayment] = useState<string>("Todos");
  const [search, setSearch] = useState<string>("");
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>(undefined);
  const [paymentStatusModalIsOpen, setPaymentStatusModalIsOpen] = useState<boolean>(false);
  const [createUpdateModalIsOpen, setCreateUpdateModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const { expenses, create, update, remove, fetchExpenses } = useExpense([]);

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

  const prepareDataForSubmission = (data: ExpenseFormData) => {
    if (data.date) {
      const [month, year] = getMonthAndYear(data.date);
      return {
        ...data,
        month,
        year: parseInt(year),
        name: capitalizeFirstLetter(data.name),
      };
    } else {
      return {
        ...data,
        name: capitalizeFirstLetter(data.name),
      };
    }
  };

  const createExpense = async (data: CreateExpenseDTO) => {
    const preparedData = prepareDataForSubmission(data);
    await create(preparedData);
    closeModal();
  };

  const updateExpense = async (data: UpdateExpenseDTO) => {
    console.log('updateExpense', data)

    const preparedData = prepareDataForSubmission(data);
    await update(preparedData);
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

  const createNextMonthExpense  = async (data: UpdateExpenseDTO) => {
    const selectedExpenseClone = {...data}
    const nextMonthDate = getNextMonth(selectedExpenseClone.date);
    const [month, year] = getMonthAndYear(nextMonthDate);

    selectedExpenseClone.date = nextMonthDate;
    selectedExpenseClone.is_paid = false;
    selectedExpenseClone.month = month;
    selectedExpenseClone.year = parseInt(year);

    await create(selectedExpenseClone);
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

  useEffect(() => {
    if (expenses && expenses.length > 0) {
      expenses.sort((a, b) => {
        const dateA: Date = new Date(a.date);
        const dateB: Date = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      filterData({ selectedMonth: month, selectedYear: year, selectedStatus: statusPayment });
    }
  }, [expenses, filterData, month, year, statusPayment]);

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