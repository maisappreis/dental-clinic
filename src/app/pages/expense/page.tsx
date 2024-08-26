"use client";
import React, { useState, useEffect, useCallback } from "react";
import Table from "./table";
import Button from "@/app/components/button";
import MonthFilter from "@/app/components/monthFilter";
import StatusFilter from "@/app/components/statusFilter";
import Search from "@/app/components/search";
import Modal from "@/app/components/modal";
import ExpenseForm from "@/app/forms/expenseForm";
import { getCurrentYear, getCurrentMonth } from "@/utils/date";
import { applySearch } from "@/utils/filter";
import { useData } from "@/app/context/DataContext";
// import { useRouter } from 'next/navigation';
// import { DataExpenseProps } from '@/types/expense';

export default function Expense() {
// export default function Expense({ expenses = [], setExpenses, loading }: DataExpenseProps) {
  const { expenses, loading } = useData();
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [statusPayment, setStatusPayment] = useState("Todos");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [formData, setFormData] = useState({});

  // const router = useRouter();
  // useEffect(() => {
  //   if (!loading && (!expenses || expenses.length === 0)) {
  //     router.push('/error');
  //   }
  // }, [expenses, loading, router]);

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
    setMonth("Todos os meses")
    setYear("Todos")

    const filterData = applySearch(expenses, search)
    setFilteredData(filterData);
  }

  const openModal: () => void = () => {
    setFormData({
      id: 0,
      year: 0,
      month: "",
      name: "",
      installments: "",
      date: "",
      value: 0,
      is_paid: false,
      notes: ""
    })
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

  if (loading && !expenses) {
    return (
      <div className="content">
        <div className="w-full h-full flex justify-center">
          <h1 className="mt-5 font-bold text-xl">Carregando despesas...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="flex flex-column justify-between">
        <Button onClick={openModal} disabled={false} >
          Nova Despesa
        </Button>
        <div className="flex justify-end" style={{ marginBottom: 15 }}>
          <MonthFilter month={month} year={year} onFilterChange={filterData} />
          <StatusFilter statusPayment={statusPayment} onStatusChange={filterData} />
          <Search search={search} onSearchChange={searchData} />
        </div>
      </div>
      <Table columns={columns} data={filteredData} />
      {/* <Table columns={columns} data={filteredData} setExpenses={() => {}} /> */}
      {showModal &&
        <Modal title={modalTitle}>
          <ExpenseForm selectedRow={formData} closeModal={closeModal} />
          {/* <ExpenseForm selectedRow={formData} closeModal={closeModal} setExpenses={() => {}} /> */}
        </Modal>
      }
    </div>
  )
}