"use client";
import React, { useState, useEffect, useCallback } from "react";

import { RevenueTable } from "@/app/pages/revenue/table";
import { Button } from "@/components/button/button";
import { Loading } from "@/components/loading/loading";
import { Search } from "@/components/search/search";
// import { StatusFilter } from "@/components/filter/statusFilter";
import MonthFilter from "@/app/common/monthFilter";
import RevenueForm from "./form";
import { Modal } from "@/components/modal/modal";

import { formatValueToBRL } from "@/utils/utils";
import { getCurrentYear, getCurrentMonth, getMonthAndYear } from "@/utils/date";
import { applySearch } from "@/utils/filter";
import { apiURL, fetchRevenue, isAuthenticated, configureAxios } from '@/utils/api';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAlertStore } from "@/stores/alert.store";
import { Revenue, RevenueData } from '@/types/revenue';
import axios from "axios";

export default function RevenuePage({ revenue = [], setRevenue, loading }: RevenueData) {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<Revenue | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const alert = useAlertStore.getState();

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
    setShowUpdateModal(false);
    setShowDeleteModal(false);
  };

  const openUpdateModal = (row: Revenue): void => {
    setShowUpdateModal(true);
    setModalTitle("Atualizar Receita");
    setSelectedRow(row);
  };

  const openDeleteModal = (row: Revenue): void => {
    setShowDeleteModal(true);
    setModalTitle("Excluir Receita");
    setSelectedRow(row);
  };

  const deleteRevenue = async () => {
    setIsLoading(true);
    try {
      if (selectedRow && selectedRow.id) {
        await axios.delete(`${apiURL()}/revenue/${selectedRow.id}/`)

        alert.show({
          message: "Receita excluída com sucesso!",
          variant: "success",
        });
        const newRevenue = await fetchRevenue();
        setRevenue(newRevenue)
      }
    } catch (error) {
      console.error('Erro ao excluir receita.', error)

      alert.show({
        message: "Erro ao excluir receita.",
        variant: "error",
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isAuthenticated();
    configureAxios();
  }, []);

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

  if (isLoading) {
    return (
      <Loading
        label="Salvando..."
      />
    );
  }

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

      <RevenueTable
        data={filteredData}
        actions={{
          onOpenUpdate: openUpdateModal,
          onOpenDelete: openDeleteModal,
        }}
      />
      <Modal open={showModal} onClose={closeModal}>
        <Modal.Header>
          {modalTitle}
        </Modal.Header>

        <Modal.Body>
          <RevenueForm
            closeModal={closeModal}
            setRevenue={setRevenue}
          />
        </Modal.Body>

        {/* <Modal.Footer>
          // TODO
        </Modal.Footer> */}
      </Modal>

      {selectedRow &&
        <Modal open={showUpdateModal} onClose={closeModal}>
          <Modal.Header>
            {modalTitle}
          </Modal.Header>

          <Modal.Body>
            <RevenueForm
              selectedRow={selectedRow}
              closeModal={closeModal}
              setRevenue={setRevenue}
            />
          </Modal.Body>

          {/* <Modal.Footer>
            // TODO
          </Modal.Footer> */}
        </Modal>
      }
      {selectedRow &&
        <Modal open={showDeleteModal} onClose={closeModal}>
          <Modal.Header>
            {modalTitle}
          </Modal.Header>

          <Modal.Body>
            Tem certeza que deseja excluir o valor de
            <strong> {formatValueToBRL(selectedRow.value)} </strong> do paciente
            <strong> {selectedRow.name}</strong>?
          </Modal.Body>

          <Modal.Footer>
            <div className="flex justify-around">
              <Button
                label="Excluir"
                variant="danger"
                size="md"
                onClick={deleteRevenue}
              />
              <Button
                label="Cancelar"
                variant="secondary"
                size="md"
                onClick={closeModal}
              />
            </div>
          </Modal.Footer>
        </Modal>
      }
    </div>
  )
};