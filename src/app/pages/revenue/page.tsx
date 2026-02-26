"use client";
import React, { useState, useEffect, useCallback } from "react";

import { RevenueTable } from "@/app/pages/revenue/table";
import { Button } from "@/components/button/button";
import { Search } from "@/components/search/search";
import { Filter } from "@/components/filter/filter";
import { CreateUpdateModal } from "./modal/createUpdate";
import { DeleteModal } from "./modal/delete";

import { getCurrentYear, getCurrentMonth, getMonthAndYear } from "@/utils/date";
import { capitalize } from '@/utils/utils';
import { applySearch } from "@/utils/filter";
import { months, years } from "@/assets/data";

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRevenue } from "@/hooks/useRevenue";
import { Revenue, CreateRevenueDTO, UpdateRevenueDTO } from '@/types/revenue';


export default function RevenuePage() {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [search, setSearch] = useState("");
  const [selectedRevenue, setSelectedRevenue] = useState<Revenue | undefined>(undefined);
  const [createUpdateModalIsOpen, setCreateUpdateModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const { revenue, create, update, remove, fetch } = useRevenue([]);

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
    await create({
      ...data,
      name: capitalize(data.name),
    });
    closeModal();
  };

  const updateRevenue = async (data: UpdateRevenueDTO) => {
    await update({
      ...data,
      name: capitalize(data.name),
    });
    closeModal();
  };

  const deleteRevenue = async () => {
    if (!selectedRevenue) return
    await remove(selectedRevenue.id);
    closeModal();
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (revenue && revenue.length > 0) {
      revenue.sort((a, b) => {
        const dateA: Date = new Date(a.date);
        const dateB: Date = new Date(b.date);
        return dateA.getTime() + dateB.getTime();
      });

      filterData({ selectedMonth: month, selectedYear: year });
    }
  }, [revenue, filterData, month, year]);

  return (
    <div className="content">
      <div className="flex flex-column justify-between" style={{ marginBottom: 15 }}>
        <Button
          label="Nova Receita"
          icon={faPlus}
          onClick={openCreateModal}
        />
        <div className="flex justify-end">
          <Filter
            value={month}
            options={months.map((item) => ({
              label: item,
              value: item,
            }))}
            onChange={(value) => {
              setMonth(value);
              filterData({ selectedMonth: value });
            }}
          />
          <Filter
            value={year}
            options={years.map((item) => ({
              label: String(item),
              value: item,
            }))}
            onChange={(value) => {
              setYear(value);
              filterData({ selectedYear: value });
            }}
          />
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