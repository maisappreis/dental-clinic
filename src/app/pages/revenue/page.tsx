"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Table from "./table";
import Button from "@/app/components/button";
import MonthFilter from "@/app/components/monthFilter";
import Search from "@/app/components/search";
import Modal from "@/app/components/modal";
import RevenueForm from "@/app/forms/revenueForm";
import { getCurrentDate, getCurrentYear, getCurrentMonth, getMonthAndYear } from "@/utils/date";
import { applySearch } from "@/utils/filter";
import { useData } from "@/app/context/DataContext";

export default function Revenue() {
  const { revenue, loading } = useData();
  const formRef = useRef<HTMLFormElement>(null);
  const [filteredData, setFilteredData] = useState(revenue);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [search, setSearch] = useState("");
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
    setSearch("");
    
    const filtered = revenue.filter(item => {
      const [month, year] = getMonthAndYear(item.date);
      if (selectedMonth === "Todos os meses" && selectedYear === "Todos") return revenue
      if (selectedMonth === "Todos os meses") return year.toString() === selectedYear
      if (selectedYear === "Todos") return month === selectedMonth
      return (
        month === selectedMonth && year.toString() === selectedYear
      );
    });
    setFilteredData(filtered);
  },[month, year, revenue])

  const searchData = (search: string) => {
    setSearch(search);
    setMonth("Todos os meses")
    setYear("Todos")

    const filterData = applySearch(revenue, search)
    setFilteredData(filterData);
  }

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
    if (!loading) {
      revenue.sort((a, b) => {
        const dateA: Date = new Date(a.date);
        const dateB: Date = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  
      filterData({ selectedMonth: month, selectedYear: year });
    }
  }, [revenue, loading, filterData, month, year]);

  return (
    <div className="content">
      <div className="flex flex-column justify-between">
        <Button onClick={openModal} disabled={false} >
          Nova Receita
        </Button>
        <div className="flex justify-end" style={{ marginBottom: 15 }}>
          <MonthFilter month={month} year={year} onFilterChange={filterData} />
          <Search search={search} onSearchChange={searchData} />
        </div>
      </div>
      <Table columns={columns} data={filteredData} />
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