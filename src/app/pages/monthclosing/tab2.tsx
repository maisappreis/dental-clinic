'use client'
import { useState } from 'react';
import styles from "./MonthClosing.module.css";

export default function TabTwo() {
  const [bankValue, setBankValue] = useState("reports");
  const [cashValue, setCashValue] = useState("reports");
  const [pagBankValue, setPagBankValue] = useState("reports");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('name', name)
    console.log('value', value)

    // let newValue = value;

    // setFormData((prevData) => ({
    //   ...prevData,
    //   [name]: newValue,
    // }));
  };

  return (
    <div className="flex justify-center">
      <div className={`${styles.box} w-1/2`}>
        <div className="flex form-item">
          <label htmlFor="value" className="form-label">Banco do Brasil:</label>
          <input id="value" name="value" type="number" className="form-input"
            value={bankValue} onChange={handleInputChange} min="0.001" step="0.001" required />
        </div>

        <div className="flex form-item">
          <label htmlFor="value" className="form-label">Dinheiro:</label>
          <input id="value" name="value" type="number" className="form-input"
            value={cashValue} onChange={handleInputChange} min="0.001" step="0.001" required />
        </div>

        <div className="flex form-item">
          <label htmlFor="value" className="form-label">PagBank:</label>
          <input id="value" name="value" type="number" className="form-input"
            value={pagBankValue} onChange={handleInputChange} min="0.001" step="0.001" required />
        </div>
      </div>
    </div>
  )
}