"use client";
import React, { useState, useEffect, useCallback } from "react";

import { RevenueTable } from "@/app/pages/revenue/table";
import { Button } from "@/components/button/button";
import { Loading } from "@/components/loading/loading";
import { Search } from "@/components/search/search";
// import { StatusFilter } from "@/components/filter/statusFilter";
import MonthFilter from "@/app/common/monthFilter";
import { Modal } from "@/components/modal/modal";
import { CreateUpdateModal } from "./modal/createUpdate";

import { formatValueToBRL } from "@/utils/utils";
import { getCurrentYear, getCurrentMonth, getMonthAndYear } from "@/utils/date";
import { capitalize } from '@/utils/utils';
import { applySearch } from "@/utils/filter";
import { apiURL, fetchRevenue, isAuthenticated, configureAxios } from '@/utils/api';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAlertStore } from "@/stores/alert.store";
import { Revenue, RevenueData, CreateRevenueDTO, UpdateRevenueDTO, RevenueFormData } from '@/types/revenue';
import axios from "axios";

export default function RevenuePage({ revenue = [], setRevenue, loading }: RevenueData) {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRevenue, setSelectedRevenue] = useState<Revenue | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  };

  const closeModal = () => {
    setShowDeleteModal(false);

    setIsModalOpen(false);
    setSelectedRevenue(undefined);
  };

  const openCreateModal = (): void =>  {
    setSelectedRevenue(undefined);
    setIsModalOpen(true);
  };

  const openUpdateModal = (revenue: Revenue): void => {
    setSelectedRevenue(revenue);
    setIsModalOpen(true);
  };

  const openDeleteModal = (revenue: Revenue): void => {
    setSelectedRevenue(revenue);
    setShowDeleteModal(true);
  };

  const prepareDataForSubmission = (data: RevenueFormData) => {
    return {
      ...data,
      name: capitalize(data.name),
    };
  };

  const createRevenue = async (revenue: CreateRevenueDTO) => {
    setIsLoading(true);
    try {
      const preparedData = prepareDataForSubmission(revenue);

      await axios.post(`${apiURL()}/revenue/create/`, preparedData)

      alert.show({
        message: "Receita criada com sucesso!",
        variant: "success",
      });
      const newRevenue = await fetchRevenue();
      setRevenue(newRevenue)
    } catch (error) {
      console.error('Erro ao criar receita.', error)

      alert.show({
        message: "Erro ao criar receita.",
        variant: "error",
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  };

  const updateRevenue = async (revenue: UpdateRevenueDTO) => {
    setIsLoading(true);
    try {
      const preparedData = prepareDataForSubmission(revenue);

      await axios.patch(`${apiURL()}/revenue/${preparedData.id}/`, preparedData)

      alert.show({
        message: "Receita atualizada com sucesso!",
        variant: "success",
      });
      const newRevenue = await fetchRevenue();
      setRevenue(newRevenue)
    } catch (error) {
      console.error('Erro ao atualizar receita.', error)

      alert.show({
        message: "Erro ao atualizar receita",
        variant: "error",
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  };

  const deleteRevenue = async () => {
    setIsLoading(true);
    try {
      if (selectedRevenue && selectedRevenue.id) {
        await axios.delete(`${apiURL()}/revenue/${selectedRevenue.id}/`)

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
          onClick={openCreateModal}
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

      <CreateUpdateModal
        open={isModalOpen}
        revenue={selectedRevenue}
        onClose={closeModal}
        onCreate={createRevenue}
        onUpdate={updateRevenue}
      />

      {selectedRevenue &&
        <Modal open={showDeleteModal} onClose={closeModal}>
          <Modal.Header>
            Excluir Receita
          </Modal.Header>

          <Modal.Body>
            Tem certeza que deseja excluir o valor de
            <strong> {formatValueToBRL(selectedRevenue.value)} </strong> do paciente
            <strong> {selectedRevenue.name}</strong>?
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