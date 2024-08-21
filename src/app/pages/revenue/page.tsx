"use client";
import React, { useState } from "react";
import Table from "@/app/components/table";
import Button from "@/app/components/button";
import MonthFilter from "@/app/components/monthFilter";
import Search from "@/app/components/search";
import Modal from "@/app/components/modal";
import RevenueForm from "@/app/forms/revenueForm";

export default function Revenue() {
  const [searchedNames, setSearchNames] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('')

  const openModal: () => void = () => {
    setShowModal(true);
    setModalTitle("Adicionar Paciente");
  };

  const updateSearchNames = (names: string[]) => {
    setSearchNames(names);
  }

  const saveRevenue = () => {
    console.log('Salvar receita...')
  }

  const closeModal = () => {
    setShowModal(false);
  }

  const columns: { key: string; name: string; }[] = [
    { key: "date", name: "Data" },
    { key: "name", name: "Paciente" },
    { key: "cpf", name: "CPF" },
    { key: "nf", name: "NF" },
    { key: "procedure", name: "Proced." },
    { key: "payment", name: "Pagamento" },
    { key: "installments", name: "Parcelas" },
    { key: "value", name: "Valor" },
    { key: "actions", name: "" },
  ];

  const data: {
    id: number;
    date: string;
    name: string;
    cpf: string | null;
    nf: boolean;
    procedure: string;
    payment: string;
    installments: number | null;
    value: number;
    notes: string;
    actions: string;
  }[] = [
      { id: 1, date: '2024-04-01', name: 'John Doe', cpf: '058.159.592-10', nf: true, procedure: 'Restauração', value: 180, payment: 'Débito', installments: null, notes: "Nota de teste", actions: '' },
      { id: 1, date: '2024-04-05', name: 'Maria Silva', cpf: null, nf: false, procedure: 'Profilaxia', value: 200, payment: 'Crédito à prazo', installments: 3, notes: "", actions: '' },
      { id: 1, date: '2024-05-25', name: 'Antonie All', cpf: null, nf: false, procedure: 'Restauração', value: 250, payment: 'Dinheiro', installments: null, notes: "Nota de teste", actions: '' },
      { id: 1, date: '2024-08-05', name: 'Joah Moé', cpf: '058.159.592-10', nf: true, procedure: 'Exodontia', value: 320, payment: 'Dinheiro', installments: null, notes: "", actions: '' },
      { id: 1, date: '2024-07-31', name: 'Will Smith', cpf: '058.159.592-10', nf: true, procedure: 'Endodontia', value: 240, payment: 'Crédito à prazo', installments: 2, notes: "Nota de teste", actions: '' },
      { id: 1, date: '2024-05-10', name: 'Clau Davi', cpf: '058.159.592-10', nf: true, procedure: 'Clareamento', value: 190, payment: 'PIX', installments: null, notes: "", actions: '' },
      { id: 1, date: '2024-06-09', name: 'Petro Atoa', cpf: null, nf: false, procedure: 'Prótese', value: 230, payment: 'Débito', installments: null, notes: "Nota de teste", actions: '' },
    ];

  return (
    <div className="content">
      <div className="flex flex-column justify-between">
        <Button onClick={openModal} disabled={false} >
          Nova Receita
        </Button>
        <div className="flex justify-end" style={{ marginBottom: 15 }}>
          <MonthFilter />
          <Search updateSearchNames={updateSearchNames} />
        </div>
      </div>
      <Table columns={columns} data={data} searchedNames={searchedNames} />
      {showModal &&
        <Modal title={modalTitle}>
          <RevenueForm />
          <div className="flex justify-around">
            <button onClick={saveRevenue} className="btn green size">
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