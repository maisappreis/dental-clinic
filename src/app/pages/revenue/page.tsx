"use client";
import React, { useState, useEffect, useCallback } from "react";
import Table from "./table";
import { Button } from "@/components/Button/Button";
import MonthFilter from "@/app/common/monthFilter";
import { Search } from "@/components/search/search";
import Modal from "@/app/common/modal";
import RevenueForm from "./form";
import { getCurrentYear, getCurrentMonth, getMonthAndYear } from "@/utils/date";
import { applySearch } from "@/utils/filter";
import { RevenueData } from '@/types/revenue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Revenue({ revenue = [], setRevenue, loading }: RevenueData) {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

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

    const filteredData = applySearch(revenue, search)
    setFilteredData(filteredData);
  }

  const openModal: () => void = () => {
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
        return dateA.getTime() + dateB.getTime();
      });

      filterData({ selectedMonth: month, selectedYear: year });
    }
  }, [revenue, loading, filterData, month, year]);

  return (
    <div className="content">
      <div className="flex flex-column justify-between" style={{ marginBottom: 15 }}>
        <Button
          label="Nova Receita"
          icon={faPlus}
          onClick={openModal}
        />
        <div className="flex justify-end">
          <MonthFilter month={month} year={year} onFilterChange={filterData} />
          <Search value={search} onValueChange={searchData} />
        </div>
      </div>
      <Table columns={columns} data={filteredData} setRevenue={setRevenue} />
      {showModal &&
        <Modal title={modalTitle}>
          <RevenueForm
            closeModal={closeModal}
            setRevenue={setRevenue}
          />
        </Modal>
      }
    </div>
  )
}