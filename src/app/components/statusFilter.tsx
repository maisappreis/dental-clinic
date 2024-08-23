"use client";
import styles from "./styles/Filter.module.css";
import React, { ChangeEvent  } from "react";

interface StatusFilterProps {
  statusPayment: string;
  onStatusChange: (params: { selectedMonth?: string; selectedYear?: string; selectedStatus: string }) => void;
}

export default function StatusFilter({ statusPayment, onStatusChange }: StatusFilterProps) {
  const statusList = ["À pagar", "Pago", "Todos"];

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = event.target.value;
    onStatusChange({selectedStatus: selectedStatus});
  };

  return (
    <div className={styles.filter}>
      <select
        className={styles.select}
        id="status"
        name="status"
        value={statusPayment}
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