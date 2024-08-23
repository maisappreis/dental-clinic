"use client";
import styles from "./styles/Filter.module.css";
import React, { ChangeEvent } from "react";
import { months, years } from '@/assets/data';


interface MonthFilterProps {
  month: string;
  year: string;
  onFilterChange: (params: { selectedMonth: string; selectedYear: string; selectedStatus?: string }) => void;
}

export default function MonthFilter({ month, year, onFilterChange}: MonthFilterProps) {

  const handleMonthChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = event.target.value;
    onFilterChange({ selectedMonth: selectedMonth, selectedYear: year});
  };

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = event.target.value;
    onFilterChange({selectedMonth: month, selectedYear: selectedYear});
  };

  return (
    <div className={styles.filter}>
      <select
        className={styles.select}
        id="month"
        name="month"
        value={month}
        onChange={handleMonthChange}
        required
      >
        <option disabled value="">Mês:</option>
        {months.map((month, index) => (
          <option key={index} value={month} className={styles.font}>
            {month}
          </option>
        ))}
      </select>
      <select
        className={styles.select}
        id="year"
        name="year"
        value={year}
        onChange={handleYearChange}
        required
      >
        <option disabled value="">Ano:</option>
        {years.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div >
  );
};