"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Table from "./table";
import Button from "@/app/components/button";
import MonthFilter from "@/app/components/monthFilter";
import Search from "@/app/components/search";
import Modal from "@/app/components/modal";
import RevenueForm from "@/app/forms/revenueForm";
import { getCurrentYear, getCurrentMonth, getMonthAndYear } from "@/utils/date";


const data: {
  id: number;
  date: string;
  name: string;
  cpf: string | null;
  nf: string;
  procedure: string;
  payment: string;
  installments: number | null;
  value: number | null;
  notes: string;
}[] = [
    { id: 1, date: '2024-04-01', name: 'John Doe', cpf: '058.159.592-10', nf: 'yes', procedure: 'Restauração', value: 180, payment: 'Débito', installments: 0, notes: "Nota XXX" },
    { id: 1, date: '2024-04-05', name: 'Maria Silva', cpf: "", nf: 'no', procedure: 'Profilaxia', value: 200, payment: 'Crédito à prazo', installments: 3, notes: "" },
    { id: 1, date: '2024-05-25', name: 'Antonie All', cpf: "", nf: 'no', procedure: 'Restauração', value: 250.55, payment: 'Dinheiro', installments: 0, notes: "Nota YYYY" },
    { id: 1, date: '2024-08-05', name: 'Joah Moé', cpf: '058.159.592-10', nf: 'yes', procedure: 'Exodontia', value: 320, payment: 'Dinheiro', installments: 0, notes: "" },
    { id: 1, date: '2024-07-31', name: 'Will Smith', cpf: '058.159.592-10', nf: 'yes', procedure: 'Endodontia', value: 240, payment: 'Crédito à prazo', installments: 2, notes: "Nota ZZZZ" },
    { id: 1, date: '2024-05-10', name: 'Clau Davi', cpf: '058.159.592-10', nf: 'yes', procedure: 'Clareamento', value: 190, payment: 'PIX', installments: 0, notes: "" },
    { id: 1, date: '2024-06-09', name: 'Petro Atoa', cpf: "", nf: 'no', procedure: 'Prótese', value: 230, payment: 'Débito', installments: 0, notes: "Nota OOOOO" },
    { id: 1, date: '2025-06-09', name: 'Petro Atoa', cpf: "", nf: 'no', procedure: 'Prótese', value: 230, payment: 'Débito', installments: 0, notes: "Nota OOOOO" },
  ];

const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function Revenue() {
  const formRef = useRef<HTMLFormElement>(null);
  const [filteredData, setFilteredData] = useState(data);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [searchedNames, setSearchNames] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    date: "",
    cpf: "",
    nf: "no",
    procedure: "",
    payment: "",
    installments: 0,
    value: 0,
    notes: ""
  });

  const columns: { key: string; name: string; }[] = [
    { key: "date", name: "Data" },
    { key: "name", name: "Paciente" },
    { key: "cpf", name: "CPF" },
    { key: "nf", name: "NF" },
    { key: "procedure", name: "Proced." },
    { key: "payment", name: "Pagamento" },
    { key: "installments", name: "Parcelas" },
    { key: "value", name: "Valor" }
  ];

  const filterData = useCallback(({selectedMonth = month, selectedYear = year,}) => {
    setMonth(selectedMonth)
    setYear(selectedYear)
    
    const filtered = data.filter(item => {
      const [month, year] = getMonthAndYear(item.date);
      if (selectedMonth === "Todos os meses" && selectedYear === "Todos") return data
      if (selectedMonth === "Todos os meses") return year.toString() === selectedYear
      if (selectedYear === "Todos") return month === selectedMonth
      return (
        month === selectedMonth && year.toString() === selectedYear
      );
    });
    setFilteredData(filtered);
  },[month, year])

  const updateSearchNames = (names: string[]) => {
    setSearchNames(names);
  };

  const handleSubmit = (formData: any) => {
    setFormData(formData);
    setShowModal(false);
  };

  const saveRevenue = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const openModal: () => void = () => {
    setFormData({
      id: 0,
      name: "",
      date: getCurrentDate(),
      cpf: "",
      nf: "no",
      procedure: "",
      payment: "",
      installments: 0,
      value: 0,
      notes: ""
    })
    setShowModal(true);
    setModalTitle("Adicionar Receita");
  };

  const closeModal = () => {
    setShowModal(false);
  };
  
  useEffect(() => {
    filterData({ selectedMonth: month, selectedYear: year });
  }, [filterData, month, year]);

  return (
    <div className="content">
      <div className="flex flex-column justify-between">
        <Button onClick={openModal} disabled={false} >
          Nova Receita
        </Button>
        <div className="flex justify-end" style={{ marginBottom: 15 }}>
          <MonthFilter month={month} year={year} onFilterChange={filterData} />
          <Search updateSearchNames={updateSearchNames} />
        </div>
      </div>
      <Table columns={columns} data={filteredData} searchedNames={searchedNames} />
      {showModal &&
        <Modal title={modalTitle}>
          <RevenueForm selectedRow={formData} onSubmit={handleSubmit} formRef={formRef} />
          <div className="flex justify-around">
            <button onClick={saveRevenue} className="btn green size" type="submit">
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