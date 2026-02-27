"use client";
import React, { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/button/button";
import { TabOneTable } from "@/app/pages/monthclosing/table";

import { formatDate } from "@/utils/date";
import { useMonthClosing } from "@/hooks/useMonthClosing";
import { Revenue } from '@/types/revenue';


export default function TabOne(
  {
    orderedRevenue,
    setOrderedRevenue
  }: {
    orderedRevenue: Revenue[],
    setOrderedRevenue: (newRevenue: Revenue[]) => void,
  }
) {
  const [updatedRevenue, setUpdatedRevenue] = useState<Revenue[]>([]);
  const [formRate, setFormRate] = useState({
    debit: 1.09,
    cashCredit: 3,
    installmentCredit: 3.4
  });

  const { updateNetValues } = useMonthClosing();

  const columns: { key: string; name: string; }[] = [
    { key: "date", name: "Data Pgto" },
    { key: "release_date", name: "Data Liberação" },
    { key: "name", name: "Nome" },
    { key: "payment", name: "Pagamento" },
    { key: "installments", name: "Parcelas" },
    { key: "value", name: "Valor Bruto" },
    { key: "net_value", name: "Valor Líquido" },
  ];

  const handleRateInputChange = (
    e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const parsedValue = value === "" ? 0 : parseFloat(value);

    setFormRate((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));

    const updatedRevenueData = calculatedRevenue(orderedRevenue);
    setUpdatedRevenue(updatedRevenueData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number) => {
    const { value } = e.target;

    setUpdatedRevenue((prevData) =>
      prevData.map((item, index) =>
        index === rowIndex
          ? { ...item, net_value: parseFloat(value) }
          : item
      )
    );
  };

  const saveRevenue = () => {
    setOrderedRevenue(updatedRevenue);
    updateRevenue();
  }

  const updateRevenue = async () => {
    const updatedNetValues = updatedRevenue.map(item => ({
      id: item.id,
      net_value: item.net_value,
      date: item.date
    }));

    await updateNetValues(updatedNetValues);
  };

  const calculatedRevenue = useCallback((sortedRevenue: Revenue[]) => {
    return sortedRevenue.map((item) => {
      let netValue = item.value;

      if (item.payment === "Débito") {
        netValue -= (item.value * (formRate.debit / 100));
      } else if (item.payment === "Crédito à vista") {
        netValue -= (item.value * (formRate.cashCredit / 100));
      } else if (item.payment === "Crédito à prazo") {
        netValue -= (item.value * (formRate.installmentCredit / 100));
      }

      return {
        ...item,
        net_value: parseFloat(netValue.toFixed(2)),
      };
    });
  }, [formRate]);

  const getReleaseDate = (dateString: string) => {
    if (dateString && dateString !== "") {
      return formatDate(dateString);
    } else {
      return "";
    }
  }

  useEffect(() => {
    if (orderedRevenue && orderedRevenue.length > 0 && updatedRevenue && updatedRevenue.length === 0) { 
      const allNetValuesZero = orderedRevenue.every(item => item.net_value === 0);
  
      if (allNetValuesZero) {
        const updatedRevenueData = calculatedRevenue(orderedRevenue);
        setUpdatedRevenue(updatedRevenueData);
        setOrderedRevenue(updatedRevenueData);
      } else {
        setUpdatedRevenue(orderedRevenue);
        setOrderedRevenue(orderedRevenue);
      }
    }
  }, [updatedRevenue, calculatedRevenue, orderedRevenue, setOrderedRevenue])

  return (
    <div>
      <div>
        <div className="flex justify-between mb-3">
          <label htmlFor="debit" className="form-label">Débito:</label>
          <input id="debit" name="debit" type="number" className="form-input mr-5"
            value={formRate.debit} onChange={handleRateInputChange} min="0.001" step="0.001" required />

          <label htmlFor="cashCredit" className="form-label">Crédito à vista:</label>
          <input id="cashCredit" name="cashCredit" type="number" className="form-input mr-5"
            value={formRate.cashCredit} onChange={handleRateInputChange} min="0.001" step="0.001" required />

          <label htmlFor="installmentCredit" className="form-label">Crédito à prazo:</label>
          <input id="installmentCredit" name="installmentCredit" type="number" className="form-input mr-5"
            value={formRate.installmentCredit} onChange={handleRateInputChange} min="0.001" step="0.001" required />
        </div>
      </div>

      <TabOneTable
        data={updatedRevenue}
        actions={{
          onInputChange: handleInputChange
        }}
      />

      <div className="flex justify-end w-full align-bottom my-3">
        <Button
          label="Salvar"
          variant="primary"
          size="lg"
          onClick={saveRevenue}
        />
      </div>
    </div>
  )
}