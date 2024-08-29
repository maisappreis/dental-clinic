'use client'
import { useState } from 'react';
import styles from "./MonthClosing.module.css";

export default function TabTwo() {
  const [bankValue, setBankValue] = useState(0);
  const [cashValue, setCashValue] = useState(0);
  const [pagBankValue, setPagBankValue] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('name', name)
    console.log('value', value)

    const newValue = parseFloat(value) || 0;

    if (name === "bankValue") {
      setBankValue(newValue);
    } else if (name === "cashValue") {
      setCashValue(newValue);
    } else if (name === "pagBankValue") {
      setPagBankValue(newValue);
    }
  };

  const sumValues = bankValue + cashValue + pagBankValue

  const diffValues = () => {
    const inputs = sumValues;
    const revenue = 7300;

    return inputs- revenue
  }

  return (
    <div className="flex justify-center">
      <div className={`${styles.box} w-1/2`}>
        <div className="flex form-item">
          <label htmlFor="bankValue" className="form-label">Banco do Brasil:</label>
          <input id="bankValue" name="bankValue" type="number" className="form-input"
            value={bankValue} onChange={handleInputChange} min="0.001" step="0.001" required />
        </div>

        <div className="flex form-item">
          <label htmlFor="cashValue" className="form-label">Dinheiro:</label>
          <input id="cashValue" name="cashValue" type="number" className="form-input"
            value={cashValue} onChange={handleInputChange} min="0.001" step="0.001" required />
        </div>

        <div className="flex form-item">
          <label htmlFor="pagBankValue" className="form-label">PagBank:</label>
          <input id="pagBankValue" name="pagBankValue" type="number" className="form-input"
            value={pagBankValue} onChange={handleInputChange} min="0.001" step="0.001" required />
        </div>
      </div>
      <div className={`${styles.summary} w-1/2`}>
      <div className="flex-col">
          <div className="flex justify-between my-2">
            <span className="mr-4 font-bold">Soma das entradas:</span>
            <span className="font-bold">R$ {(sumValues).toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
        <div className="flex-col">
          <div className="flex justify-between my-2">
            <span className="mr-4 font-bold">Receita Bruta:</span>
            <span className="font-bold">R$ 7300,00</span>
          </div>
        </div>
        <p className="my-4">A soma das entradas deve ser igual ao valor da receita bruta calculada.</p>
        <div className="flex-col">
          <div className="flex justify-between my-2">
            <span className={`mr-4 font-bold ${diffValues() === 0 ? styles.green : styles.red}`}>
              Diferença:
            </span>
            <span className={`font-bold ${diffValues() === 0 ? styles.green : styles.red}`}>
              R$ {(diffValues()).toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}