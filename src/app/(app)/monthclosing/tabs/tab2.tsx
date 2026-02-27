'use client'
import { useEffect, useState } from 'react';
import styles from "../MonthClosing.module.css";
import { MonthClosingData, MonthClosing } from "@/types/monthClosing";
import { formatValueToBRL } from "@/utils/utils";
import { Button } from "@/components/button/button";
import { useMonthClosing } from "@/hooks/useMonthClosing";

export default function TabTwo({ selectedMonthClosing, setSelectedMonthClosing, orderedRevenue }: MonthClosingData) {
  const [bankValue, setBankValue] = useState<number>(0);
  const [cashValue, setCashValue] = useState<number>(0);
  const [cardValue, setCardValue] = useState<number>(0);
  const [cardValueNext, setCardValueNext] = useState<number>(0);
  const [totalMonthlyRevenue, setTotalMonthlyRevenue] = useState<number>(0);

  const { create, update } = useMonthClosing();

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

  const createMonthClosing = async (updatedMonthClosing: MonthClosing) => {
    const response = await create(updatedMonthClosing);

    setSelectedMonthClosing(response);
  };

  const updateMonthClosing = async (updatedMonthClosing: MonthClosing) => {
    const response = await update(updatedMonthClosing);

    setSelectedMonthClosing(response);
  };

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
    if (orderedRevenue && orderedRevenue.length > 0) {
      const netValue = orderedRevenue.map(e => e.net_value);
      const sumNetValue = netValue.reduce((acc, num) => acc + num, 0);

      setTotalMonthlyRevenue(sumNetValue);
    }
  }, [orderedRevenue])

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
          <strong>Cartão do mês seguinte: </strong>
          podem haver valores que são referentes a receita do mês que vem, mas que já estão liberados.
          Esses valores devem ser subtraídos, pois entrarão apenas no mês seguinte.
        </div>
        <div className="flex justify-end w-full align-bottom mt-3">
          <Button
            label="Salvar"
            variant="primary"
            size="lg"
            onClick={saveValues}
          />
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
    </div>
  )
}