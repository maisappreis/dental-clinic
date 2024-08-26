"use client";
import React, { useState, useEffect, useCallback } from "react";
import Table from "./table";
import Button from "@/app/components/button";
import MonthFilter from "@/app/components/monthFilter";
import Search from "@/app/components/search";
import Modal from "@/app/components/modal";
import RevenueForm from "@/app/forms/revenueForm";
import { getCurrentDate, getCurrentYear, getCurrentMonth, getMonthAndYear } from "@/utils/date";
import { applySearch } from "@/utils/filter";
// import { useData } from "@/app/context/DataContext";
import { useRouter } from 'next/navigation';
import { DataRevenueProps } from '@/types/revenue';

export default function Revenue({revenue, setRevenue, loading}: DataRevenueProps) {
  // const { revenue, loading } = useData();
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [formData, setFormData] = useState({});

  const router = useRouter();
  useEffect(() => {
    if (!loading && (!revenue || revenue.length === 0)) {
      router.push('/error');
    }
  }, [revenue, loading, router]);

  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // if (!isClient) {
  //   return null;
  // }
 
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

  const filterData = useCallback(({ selectedMonth = month, selectedYear = year, }) => {
    setMonth(selectedMonth)
    setYear(selectedYear)
    setSearch("");

    if (revenue && revenue.length > 0) {
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
    } else {
      setFilteredData([]);
    }
    
  }, [month, year, revenue])

  const searchData = (search: string) => {
    setSearch(search);
    setMonth("Todos os meses")
    setYear("Todos")

    const filterData = applySearch(revenue, search)
    setFilteredData(filterData);
  }

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
    if (!loading && revenue && revenue.length > 0) {
      revenue.sort((a, b) => {
        const dateA: Date = new Date(a.date);
        const dateB: Date = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      filterData({ selectedMonth: month, selectedYear: year });
    }

    // if (!loading && (!revenue || revenue.length === 0)) {
    //   router.push('/error');
    // }
  }, [revenue, loading, filterData, month, year]);

  // useEffect(() => {
  //   if (!loading && (!revenue || revenue.length === 0)) {
  //     router.push('/404');
  //   }
  // }, [loading, revenue, router]);

  if (loading) {
    return (
      <div className="content">
        <div className="w-full h-full flex justify-center">
          <h1 className="mt-5 font-bold text-xl">Carregando receitas...</h1>
        </div>
      </div>
    );
  }

  // if (!loading && !revenue) {
  //   return (
  //   <div>
  //     Página não encontrada
  //   </div>
  //   );
  // }

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
      <Table columns={columns} data={filteredData} setRevenue={setRevenue} />
      {showModal &&
        <Modal title={modalTitle}>
          <RevenueForm selectedRow={formData} closeModal={closeModal} setRevenue={setRevenue} />
        </Modal>
      }
    </div>
  )
}