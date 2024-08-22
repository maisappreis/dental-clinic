"use client";
import React, { useState, useRef } from "react";
import Table from "./table";
import Button from "@/app/components/button";
import MonthFilter from "@/app/components/monthFilter";
import StatusFilter from "@/app/components/statusFilter";
import Search from "@/app/components/search";
import Modal from "@/app/components/modal";
import RevenueForm from "@/app/forms/revenueForm";
import ExpenseForm from "@/app/forms/expenseForm";

const data: {
  id: number;
  year: number;
  month: string;
  name: string;
  installments: string;
  date: string;
  value: number;
  status: boolean;
  notes: string;
}[] = [
    { id: 1, year: 2024, month: "Março", name: 'Aluguel', installments: "", date: '2024-03-15', value: 800, status: true, notes: "" },
    { id: 3, year: 2024, month: "Março", name: 'Energia elétrica', installments: "", date: '2024-03-01', value: 128.56, status: false, notes: "Nota XXX" },
    { id: 2, year: 2024, month: "Março", name: 'ISS', installments: "2/6", date: '2024-05-01', value: 156.23, status: false, notes: "Nota YYYY" },
    { id: 2, year: 2024, month: "Março", name: 'Alvará', installments: "3/10", date: '2024-04-30', value: 169.95, status: false, notes: "" },
    { id: 2, year: 2024, month: "Março", name: 'Colix', installments: "", date: '2024-04-12', value: 65, status: true, notes: "Nota EEEE" },
    { id: 2, year: 2024, month: "Março", name: 'Internet', installments: "", date: '2024-05-16', value: 99.9, status: false, notes: "Nota VVVVVV" },
  ];

// const getCurrentDate = (): string => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, '0');
//   const day = String(today.getDate()).padStart(2, '0');

//   return `${year}-${month}-${day}`;
// };

export default function Expense() {
  const formRef = useRef<HTMLFormElement>(null);
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
    status: false,
    notes: ""
  });

  const columns: { key: string; name: string; }[] = [
    { key: "year", name: "Ano" },
    { key: "month", name: "Mês" },
    { key: "name", name: "Conta" },
    { key: "installments", name: "Parcelas" },
    { key: "date", name: "Data de Venc." },
    { key: "value", name: "Valor" },
    { key: "status", name: "Status" },
  ];

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
      status: false,
      notes: ""
    })
    setShowModal(true);
    setModalTitle("Adicionar Despesa");
  };

  const closeModal = () => {
    setShowModal(false);
  };


  return (
    <div className="content">
      <div className="flex flex-column justify-between">
        <Button onClick={openModal} disabled={false} >
          Nova Despesa
        </Button>
        <div className="flex justify-end" style={{marginBottom: 15}}>
          <MonthFilter />
          <StatusFilter />
          <Search updateSearchNames={updateSearchNames} />
        </div>
      </div>
      <Table columns={columns} data={data} searchedNames={searchedNames} />
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