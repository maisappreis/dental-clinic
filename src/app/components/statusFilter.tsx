"use client";
import styles from "./styles/Filter.module.css";
import React, { useState, ChangeEvent  } from "react";

export default function StatusFilter() {
  const [paymentStatus, setPaymentStatus] = useState("");

  const statusList = ["À pagar", "Pago"];

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = event.target.value;
    setPaymentStatus(selectedStatus);
  };

  return (
    <div className={styles.filter}>
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