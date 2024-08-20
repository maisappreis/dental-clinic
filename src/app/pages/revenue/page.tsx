"use client";
import React, { useState } from "react";
import Table from "@/app/components/table";
import Button from "@/app/components/button";
import Filter from "@/app/components/filter";
import Search from "@/app/components/search";

export default function Revenue() {
  const [searchedNames, setSearchNames] = useState<string[]>([]);

  const addRevenue: () => void = () => {
    console.log('Action executed!');
  };

  const updateSearchNames = (names: string[]) => {
    setSearchNames(names);
  }

  const columns: { key: string; name: string; }[] = [
    { key: "date", name: "Data" },
    { key: "name", name: "Paciente" },
    { key: "cpf", name: "CPF" },
    { key: "nf", name: "NF"},
    { key: "procedure", name: "Procedimento" },
    { key: "payment", name: "Forma de pgto" },
    { key: "installments", name: "Nº parcelas" },
    { key: "value", name: "Valor" },
    { key: "actions", name: "" },
  ];

  const data: { 
    id: number;
    date: string;
    name: string;
    cpf: string;
    nf: boolean;
    procedure: string;
    value: number;
    payment: string;
    installments: number;
    actions: string;
  }[] = [
    { id: 1, date: '2024-04-01', name: 'John Doe', cpf: '058.159.592-10', nf: true, procedure: 'Restauração', value: 180, payment: 'Débito', installments: 0, actions: '' },
    { id: 1, date: '2024-04-05', name: 'Maria Silva', cpf: '058.159.592-10', nf: false, procedure: 'Profilaxia', value: 200, payment: 'Crédito à prazo', installments: 3, actions: '' },
    { id: 1, date: '2024-05-25', name: 'Antonie All', cpf: '058.159.592-10', nf: false, procedure: 'Restauração', value: 250, payment: 'Dinheiro', installments: 0, actions: '' },
    { id: 1, date: '2024-08-05', name: 'Joah Moé', cpf: '058.159.592-10', nf: true, procedure: 'Exodontia', value: 320, payment: 'Dinheiro', installments: 0, actions: '' },
    { id: 1, date: '2024-07-31', name: 'Will Smith', cpf: '058.159.592-10', nf: true, procedure: 'Endodontia', value: 240, payment: 'PIX', installments: 0, actions: '' },
    { id: 1, date: '2024-05-10', name: 'Clau Davi', cpf: '058.159.592-10', nf: false, procedure: 'Clareamento', value: 190, payment: 'PIX', installments: 0, actions: '' },
    { id: 1, date: '2024-06-09', name: 'Petro Atoa', cpf: '058.159.592-10', nf: false, procedure: 'Prótese', value: 230, payment: 'Débito', installments: 0, actions: '' },
  ];

  return (
    <div className="content">
      <div className="flex flex-column justify-between">
        <Button onClick={addRevenue} disabled={false} >
          Nova Receita
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