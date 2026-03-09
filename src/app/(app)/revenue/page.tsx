"use client";
import { useState, useEffect, useMemo } from "react";

import { RevenueTable } from "@/app/(app)/revenue/table/table";
import { Button } from "@/components/button/button";
import { Search } from "@/components/search/search";
import { Filter } from "@/components/filter/filter";
import { Spinner } from "@/components/spinner/spinner";
import { CreateUpdateModal } from "./modals/createUpdate";
import { DeleteModal } from "./modals/delete";

import { getCurrentYear, getCurrentMonth } from "@/utils/date";
import { applySearch } from "@/utils/search";
import { filterRevenueByMonthAndYear } from "@/utils/filter";
import { months, years } from "@/constants/date";

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRevenue } from "@/hooks/useRevenue";
import { Revenue, CreateRevenueDTO, UpdateRevenueDTO } from '@/types/revenue';


export default function RevenuePage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [search, setSearch] = useState("");
  const [selectedRevenue, setSelectedRevenue] = useState<Revenue | undefined>(undefined);
  const [createUpdateModalIsOpen, setCreateUpdateModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const { revenue, create, update, remove, fetchRevenue, isLoading } = useRevenue([]);

  const filteredData = useMemo<Revenue[]>(() => {
    if (!revenue.length) return [];

    let result = revenue;

    result = filterRevenueByMonthAndYear(result, {
      month,
      year,
    });

    if (search) result = applySearch(result, search);

    return result;
  }, [revenue, month, year, search]);

  const searchData = (value: string) => {
    setSearch(value);
  };

  const openCreateModal = (): void =>  {
    setSelectedRevenue(undefined);
    setCreateUpdateModalIsOpen(true);
  };

  const openUpdateModal = (revenue: Revenue): void => {
    setSelectedRevenue(revenue);
    setCreateUpdateModalIsOpen(true);
  };

  const openDeleteModal = (revenue: Revenue): void => {
    setSelectedRevenue(revenue);
    setDeleteModalIsOpen(true);
  };

  const closeModal = () => {
    setCreateUpdateModalIsOpen(false);
    setDeleteModalIsOpen(false);
    setSelectedRevenue(undefined);
  };

  const createRevenue = async (data: CreateRevenueDTO) => {
    await create(data);
    closeModal();
  };

  const updateRevenue = async (data: UpdateRevenueDTO) => {
    await update(data);
    closeModal();
  };

  const deleteRevenue = async () => {
    if (!selectedRevenue) return
    await remove(selectedRevenue.id);
    closeModal();
  };

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return (
    <div className="app-content">
      <div className="flex flex-column justify-between mb-5">
        <Button
          label="Nova Receita"
          icon={faPlus}
          onClick={openCreateModal}
        />
        <div className="flex justify-end">
          <Filter
            value={month}
            options={[
              { label: "Todos", value: "Todos" },
              ...months.map((item) => ({
                label: item,
                value: item,
              })),
            ]}
            onChange={setMonth}
          />
          <Filter
            value={year}
            options={[
              { label: "Todos", value: "Todos" },
              ...years.map((item) => ({
                label: item,
                value: item,
              })),
            ]}
            onChange={setYear}
          />
          <Search value={search} onValueChange={searchData} />
        </div>
      </div>

      {isLoading ? (<Spinner/>) : (
        <RevenueTable
          data={filteredData}
          actions={{
            onOpenUpdate: openUpdateModal,
            onOpenDelete: openDeleteModal,
          }}
        />
      )}
      
      <CreateUpdateModal
        open={createUpdateModalIsOpen}
        revenue={selectedRevenue}
        onClose={closeModal}
        onCreate={createRevenue}
        onUpdate={updateRevenue}
      />

      <DeleteModal
        open={deleteModalIsOpen}
        revenue={selectedRevenue}
        onClose={closeModal}
        onDelete={deleteRevenue}
      />
    </div>
  )
};