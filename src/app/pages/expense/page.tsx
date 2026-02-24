"use client";
import React, { useState, useEffect, useCallback } from "react";

import { ExpenseTable } from "@/app/pages/expense/table";
import { Button } from "@/components/button/button";
import { Loading } from "@/components/loading/loading";
import { Search } from "@/components/search/search";
// import { StatusFilter } from "@/components/filter/statusFilter";
import MonthFilter from "@/app/common/monthFilter";
import ExpenseForm from "./form";
import { Modal } from "@/components/modal/modal";

import { formatValueToBRL } from "@/utils/utils";
import { getCurrentYear, getCurrentMonth } from "@/utils/date";
import { applySearch } from "@/utils/filter";
import { getNextMonth, getMonthAndYear } from "@/utils/date";
import { apiURL, fetchExpenses, isAuthenticated, configureAxios } from '@/utils/api';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAlertStore } from "@/stores/alert.store";
import { Expense, ExpenseData } from "@/types/expense";
import axios from "axios";

export default function ExpensePage({ expenses = [], setExpenses, loading }: ExpenseData) {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [statusPayment, setStatusPayment] = useState<string>("Todos");
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  
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

  const openModal: () => void = () => {
    setShowModal(true);
    setModalTitle("Adicionar Despesa");
  };

  const closeModal = () => {
    setShowModal(false);

    setShowUpdateModal(false);
    setShowDeleteModal(false);
    setShowConfirmationModal(false);
  };

  const changePaymentStatus = async () => {
    if (selectedRow) await updateExpense(selectedRow)
    setShowConfirmationModal(false);
  };

  const openConfirmationModal = (row: Expense): void => {
    setSelectedRow(row);

    let title = "";

    if (row.is_paid) {
      title = "Marcar como à pagar?";
    } else {
      title = "Marcar como pago?";
    }

    setModalTitle(title);
    setShowConfirmationModal(true);
  };

  const openUpdateModal = (row: Expense): void => {
    console.log('open..')
    setShowUpdateModal(true);
    setModalTitle("Atualizar Despesa");
    setSelectedRow(row);
  };

  const openDeleteModal = (row: Expense): void => {
    setShowDeleteModal(true);
    setModalTitle("Excluir Despesa");
    setSelectedRow(row);
  };

  const updateExpense = async (row: Expense) => {
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
      const selectedRowClone = {...row}
      const nextMonthDate = getNextMonth(selectedRowClone.date);
      const [month, year] = getMonthAndYear(nextMonthDate);

      selectedRowClone.date = nextMonthDate;
      selectedRowClone.is_paid = false;
      selectedRowClone.month = month;
      selectedRowClone.year = parseInt(year);

      await axios.post(`${apiURL()}/expense/create/`, selectedRowClone)

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
      if (selectedRow && selectedRow.id) {
        await axios.delete(`${apiURL()}/expense/${selectedRow.id}/`)

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
          onClick={openModal}
        />
        <div className="flex justify-end">
          <MonthFilter month={month} year={year} onFilterChange={filterData} />
          {/* <StatusFilter
            value={statusPayment}
            onValueChange={filterData}
            options={[
              { label: "À pagar", value: "À pagar" },
              { label: "Pago", value: "Pago" },
              { label: "Todos", value: "Todos" },
            ]}
          /> */}
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

      <Modal open={showModal} onClose={closeModal}>
        <Modal.Header>
          {modalTitle}
        </Modal.Header>

        <Modal.Body>
          <ExpenseForm
            closeModal={closeModal}
            setExpenses={setExpenses}
          />
        </Modal.Body>

        {/* <Modal.Footer>
          
        </Modal.Footer> */}
      </Modal>

      {selectedRow &&
        <Modal open={showUpdateModal} onClose={closeModal}>
          <Modal.Header>
            {modalTitle}
          </Modal.Header>

          <Modal.Body>
            <ExpenseForm
              selectedRow={selectedRow}
              closeModal={closeModal}
              setExpenses={setExpenses}
            />
          </Modal.Body>

          {/* <Modal.Footer>
            // TODO
          </Modal.Footer> */}
        </Modal>
      }
      {selectedRow &&
        <Modal open={showDeleteModal} onClose={closeModal}>
          <Modal.Header>
            {modalTitle}
          </Modal.Header>

          <Modal.Body>
            Tem certeza que deseja excluir o valor de
            <strong>{formatValueToBRL(selectedRow.value)}
            </strong> referente a despesa de <strong>{selectedRow.name}</strong>?
          </Modal.Body>

          <Modal.Footer>
            <div className="flex justify-around">
              <Button
                label="Excluir"
                variant="danger"
                size="md"
                onClick={deleteExpense}
              />
              <Button
                label="Cancelar"
                variant="secondary"
                size="md"
                onClick={closeModal}
              />
            </div>
          </Modal.Footer>
        </Modal>
      }
      {selectedRow &&
        <Modal open={showConfirmationModal} onClose={closeModal}>
          <Modal.Header>
            {modalTitle}
          </Modal.Header>

          {/* <Modal.Body>
            // TODO
          </Modal.Body> */}

          <Modal.Footer>
            <div className="flex justify-around mt-3">
              <Button
                label="Confirmar"
                variant="primary"
                size="lg"
                onClick={changePaymentStatus}
              />
              <Button
                label="Cancelar"
                variant="secondary"
                size="md"
                onClick={closeModal}
              />
            </div>
          </Modal.Footer>
        </Modal>
      }
    </div>
  )
};