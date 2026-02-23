"use client";
import React, { useState, useEffect, useCallback } from "react";
import Table from "./table";
import { Button } from "@/components/button/button";
import MonthFilter from "@/app/common/monthFilter";
import StatusFilter from "@/app/common/statusFilter";
// import { StatusFilter } from "@/components/filter/statusFilter";
import { Search } from "@/components/search/search";
import Modal from "@/app/common/modal";
import ExpenseForm from "./form";
import { getCurrentYear, getCurrentMonth } from "@/utils/date";
import { applySearch } from "@/utils/filter";
import { ExpenseData } from "@/types/expense";
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Expense({ expenses = [], setExpenses, loading }: ExpenseData) {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [statusPayment, setStatusPayment] = useState<string>("Todos");
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");

  const columns: { key: string; name: string; }[] = [
    { key: "year", name: "Ano" },
    { key: "month", name: "Mês" },
    { key: "name", name: "Conta" },
    { key: "installments", name: "Parcelas" },
    { key: "date", name: "Data de Venc." },
    { key: "value", name: "Valor" },
    { key: "is_paid", name: "Status" },
  ];

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
  };

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
          <StatusFilter statusPayment={statusPayment} onStatusChange={filterData} />
          <Search value={search} onValueChange={searchData} />
        </div>
      </div>
      <Table columns={columns} data={filteredData} setExpenses={setExpenses} />
      {showModal &&
        <Modal title={modalTitle}>
          <ExpenseForm
            closeModal={closeModal}
            setExpenses={setExpenses}
          />
        </Modal>
      }
    </div>
  )
}