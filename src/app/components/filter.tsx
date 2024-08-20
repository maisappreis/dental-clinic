"use client";
import styles from "./styles/Filter.module.css";
import React, { useState, ChangeEvent  } from "react";

export default function Filter() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Todos os meses"];
  const years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, "Todos"];
  const statusList = ["À pagar", "Pago"];

  const handleMonthChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = event.target.value;
    console.log("selectedMonth", selectedMonth)
    setMonth(selectedMonth);
    // props.getMonth(selectedMonth);
  };

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = event.target.value;
    setYear(selectedYear);
    // props.getYear(selectedYear);
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = event.target.value;
    setPaymentStatus(selectedStatus);
    // props.getStatus(selectedStatus);
  };

  return (
    <div className={styles.filter}>
      <select
        className="form-select font month"
        id="month"
        name="month"
        value={month}
        onChange={handleMonthChange}
        required
      >
        <option disabled value="">Mês:</option>
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>
      <select
        className="form-select font"
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
      <select
        className="form-select font status"
        id="status"
        name="status"
        value={paymentStatus}
        onChange={handleStatusChange}
        required
      >
        <option disabled value="">Status:</option>
        {statusList.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div >
  );
};