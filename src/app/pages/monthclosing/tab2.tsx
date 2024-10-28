'use client'
import { useEffect, useState } from 'react';
import styles from "./MonthClosing.module.css";
import { MonthClosingData, MonthClosingProps } from "@/types/monthClosing";
import { calculateMonthlyRevenue, formatValueToBRL } from "@/utils/utils";
import Alert from '@/app/common/alert';
import { apiURL, isAuthenticated, configureAxios } from '@/utils/api';
import axios from "axios";

export default function TabTwo({ revenue, selectedMonthClosing, setSelectedMonthClosing }: MonthClosingData) {
  const [bankValue, setBankValue] = useState(0);
  const [cashValue, setCashValue] = useState(0);
  const [cardValue, setCardValue] = useState(0);
  const [cardValueNext, setCardValueNext] = useState(0);
  const [totalMonthlyRevenue, setTotalMonthlyRevenue] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = parseFloat(value) || 0;

    if (name === "bankValue") {
      setBankValue(newValue);
    } else if (name === "cashValue") {
      setCashValue(newValue);
    } else if (name === "cardValue") {
      setCardValue(newValue);
    } else if (name === "cardValueNext") {
      setCardValueNext(newValue);
    }
  };

  const saveValues = async () => {
    const updatedMonthClosing = {
      ...selectedMonthClosing,
    bank_value: bankValue,
    cash_value: cashValue,
    card_value: cardValue,
    card_value_next_month: cardValueNext,
    };

    if (selectedMonthClosing.id === 0) {
      await createMonthClosing(updatedMonthClosing);
    } else {
      await updateMonthClosing(updatedMonthClosing);
    }
  };

  const createMonthClosing = async (updatedMonthClosing: MonthClosingProps) => {
    try {
      const response = await axios.post(`${apiURL()}/month_closing/create/`, updatedMonthClosing)
      setSelectedMonthClosing(response.data);

      setAlertMessage("Dados salvos com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar os dados.', error)
      setAlertMessage("Erro ao salvar os dados.");
    }
  }

  const updateMonthClosing = async (updatedMonthClosing: MonthClosingProps) => {
    try {
      const response = await axios.put(`${apiURL()}/month_closing/${selectedMonthClosing.id}/`, updatedMonthClosing);
      setSelectedMonthClosing(response.data);

      setAlertMessage("Dados salvos com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar os dados.', error)
      setAlertMessage("Erro ao salvar os dados.");
    }
  }

  const sumValues = bankValue + cashValue + cardValue - cardValueNext;

  const diffValues = (): number => {
    const inputs = sumValues;
    return inputs - totalMonthlyRevenue;
  };

  useEffect(() => {
    if (selectedMonthClosing && selectedMonthClosing.id > 0) {
      setBankValue(selectedMonthClosing.bank_value);
      setCashValue(selectedMonthClosing.cash_value);
      setCardValue(selectedMonthClosing.card_value);
      setCardValueNext(selectedMonthClosing.card_value_next_month);
    }
  }, [selectedMonthClosing])

  useEffect(() => {
    if (revenue && revenue.length > 0) {
      const currentMonth = selectedMonthClosing.month;
      const currentYear = selectedMonthClosing.year;
      const totalRevenue = calculateMonthlyRevenue(revenue, currentMonth, currentYear);

      setTotalMonthlyRevenue(totalRevenue);
    }
  }, [revenue, setTotalMonthlyRevenue, selectedMonthClosing]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("")
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  useEffect(() => {
    isAuthenticated();
    configureAxios();
  }, []);

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
          <label htmlFor="cardValue" className="form-label">Cartão:</label>
          <input id="cardValue" name="cardValue" type="number" className="form-input"
            value={cardValue} onChange={handleInputChange} min="0.001" step="0.001" required />
        </div>

        <div className="flex form-item">
          <label htmlFor="cardValueNext" className="form-label">Cartão mês seguinte:</label>
          <input id="cardValueNext" name="cardValueNext" type="number" className="form-input"
            value={cardValueNext} onChange={handleInputChange} min="0.001" step="0.001" required />
        </div>
        <div className={styles.speechbubble}>
          <strong>Cartão do mês seguinte: </strong>podem haver valores que são referentes a receita do mês que vem, mas que já estão liberados.
          Esses valores devem ser subtraídos, pois entrarão apenas no mês seguinte.
        </div>
        <div className="flex justify-end w-full align-bottom mt-3">
          <button className="btn green size-fit" onClick={saveValues}>
            Salvar
          </button>
        </div>
      </div>
      <div className={`${styles.summary} w-1/2`}>
        <div className="flex-col">
          <div className="flex justify-between my-2">
            <span className="mr-4 font-bold">Soma das entradas:</span>
            <span className="font-bold">{formatValueToBRL(sumValues)}</span>
          </div>
        </div>
        <div className="flex-col">
          <div className="flex justify-between my-2">
            <span className="mr-4 font-bold">Receita Líquida:</span>
            <span className="font-bold">{formatValueToBRL(totalMonthlyRevenue)}</span>
          </div>
        </div>
        <p className="my-4">A soma das entradas deve ser igual ao valor da receita líquida calculada.</p>
        <div className="flex-col">
          <div className="flex justify-between my-2">
            <span className={`mr-4 font-bold ${diffValues() === 0 ? styles.green : styles.red}`}>
              Diferença:
            </span>
            <span className={`font-bold ${diffValues() === 0 ? styles.green : styles.red}`}>
              {formatValueToBRL(diffValues())}
            </span>
          </div>
        </div>
      </div>
      <Alert message={alertMessage} />
    </div>
  )
}