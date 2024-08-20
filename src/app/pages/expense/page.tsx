"use client";
import React, { useState } from "react";
import Table from "@/app/components/table";
import Button from "@/app/components/button";
import Filter from "@/app/components/filter";
import Search from "@/app/components/search";

export default function Expense() {
  const [searchedNames, setSearchNames] = useState<string[]>([]);

  const addExpense: () => void = () => {
    console.log('Action executed!');
  };

  const updateSearchNames = (names: string[]) => {
    setSearchNames(names);
  }

  const columns: { key: string; name: string; }[] = [
    { key: "year", name: "Ano" },
    { key: "month", name: "Mês" },
    { key: "name", name: "Conta" },
    { key: "date", name: "Data de Venc." },
    { key: "value", name: "Valor" },
    { key: "status", name: "Status" },
    { key: "actions", name: "" },
  ];

  const data: {
    id: number;
    year: number;
    month: string;
    name: string;
    date: string;
    value: number;
    status: boolean;
    actions: string;
  }[] = [
      { id: 1, year: 2024, month: "Março", name: 'Aluguel', date: '2024-03-15', value: 800, status: true, actions: '' },
      { id: 3, year: 2024, month: "Março", name: 'Energia elétrica', date: '2024-03-01', value: 128.56, status: false, actions: '' },
      { id: 2, year: 2024, month: "Março", name: 'ISS', date: '2024-05-01', value: 156.23, status: false, actions: '' },
      { id: 2, year: 2024, month: "Março", name: 'Alvará', date: '2024-04-30', value: 169.95, status: false, actions: '' },
      { id: 2, year: 2024, month: "Março", name: 'Colix', date: '2024-04-12', value: 65, status: true, actions: '' },
      { id: 2, year: 2024, month: "Março", name: 'Internet', date: '2024-05-16', value: 99.9, status: false, actions: '' },
    ];

  return (
    <div className="content">
      <div className="flex flex-column justify-between">
        <Button onClick={addExpense} disabled={false} >
          Nova Despesa
        </Button>
        <div className="flex justify-end">
          <Search updateSearchNames={updateSearchNames} />
          <Filter />
        </div>
      </div>
      <Table columns={columns} data={data} searchedNames={searchedNames} />
    </div>
  )
}