"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Table from "./table";
import Button from "@/app/components/button";
import MonthFilter from "@/app/components/monthFilter";
import StatusFilter from "@/app/components/statusFilter";
import Search from "@/app/components/search";
import Modal from "@/app/components/modal";
import ExpenseForm from "@/app/forms/expenseForm";
import { getCurrentYear, getCurrentMonth, getMonthAndYear } from "@/utils/date";

interface DataProps {
  id: number;
  year: number;
  month: string;
  name: string;
  installments: string;
  date: string;
  value: number;
  is_paid: boolean;
  notes: string;
}

const data: {
  id: number;
  year: number;
  month: string;
  name: string;
  installments: string;
  date: string;
  value: number;
  is_paid: boolean;
  notes: string;
}[] = [
    { id: 1, year: 2025, month: "Março", name: 'Aluguel', installments: "", date: '2024-03-15', value: 800, is_paid: true, notes: "" },
    { id: 3, year: 2024, month: "Março", name: 'Energia elétrica', installments: "", date: '2024-03-01', value: 128.56, is_paid: false, notes: "Nota XXX" },
    { id: 2, year: 2024, month: "Agosto", name: 'ISS', installments: "2/6", date: '2024-05-01', value: 156.23, is_paid: false, notes: "Nota YYYY" },
    { id: 2, year: 2024, month: "Setembro", name: 'Alvará', installments: "3/10", date: '2024-04-30', value: 169.95, is_paid: false, notes: "" },
    { id: 2, year: 2024, month: "Setembro", name: 'Colix', installments: "", date: '2024-04-12', value: 65, is_paid: true, notes: "Nota EEEE" },
    { id: 2, year: 2024, month: "Agosto", name: 'Internet', installments: "", date: '2024-05-16', value: 99.9, is_paid: false, notes: "Nota VVVVVV" },
  ];

export default function Expense() {
  const formRef = useRef<HTMLFormElement>(null);
  const [filteredData, setFilteredData] = useState(data);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [statusPayment, setStatusPayment] = useState("Todos");
  const [searchedNames, setSearchNames] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [formData, setFormData] = useState({
    id: 0,
    year: 0,
    month: "",
    name: "",
    installments: "",
    date: "",
    value: 0,
    is_paid: false,
    notes: ""
  });

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

    let isPaid = false;

    if (selectedStatus === "À pagar") isPaid = false;
    if (selectedStatus === "Pago") isPaid = true;

    const filtered = data.filter(item => {
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
  }, [month, year, statusPayment]);

  const updateSearchNames = (names: string[]) => {
    setSearchNames(names);
  };

  const handleSubmit = (formData: any) => {
    setFormData(formData);
    setShowModal(false);
  };

  const saveExpense = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

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
    filterData({ selectedMonth: month, selectedYear: year, selectedStatus: statusPayment });
  }, [filterData, month, year, statusPayment]);

  return (
    <div className="content">
      <div className="flex flex-column justify-between">
        <Button onClick={openModal} disabled={false} >
          Nova Despesa
        </Button>
        <div className="flex justify-end" style={{marginBottom: 15}}>
          <MonthFilter month={month} year={year} onFilterChange={filterData} />
          <StatusFilter statusPayment={statusPayment} onStatusChange={filterData} />
          <Search updateSearchNames={updateSearchNames} />
        </div>
      </div>
      <Table columns={columns} data={filteredData} searchedNames={searchedNames} />
      {showModal &&
        <Modal title={modalTitle}>
          <ExpenseForm selectedRow={formData} onSubmit={handleSubmit} formRef={formRef} />
          <div className="flex justify-around">
            <button onClick={saveExpense} className="btn green size" type="submit">
              Salvar
            </button>
            <button onClick={closeModal} className="btn red size">
              Cancelar
            </button>
          </div>
        </Modal>
      }
    </div>
  )
}