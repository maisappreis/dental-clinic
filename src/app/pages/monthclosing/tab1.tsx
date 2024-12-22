"use client";
import React, { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/utils/date";
import { RevenueProps } from '@/types/revenue';
import axios from "axios";
import Alert from '@/app/common/alert';
import Loading from "@/app/common/loading";
import { apiURL, isAuthenticated, configureAxios } from '@/utils/api';
import { formatValueToBRL } from "@/utils/utils";
import styles from "./MonthClosing.module.css";

export default function TabOne(
  { orderedRevenue, setRevenue }: { orderedRevenue: RevenueProps[], setRevenue: (newRevenue: RevenueProps[]) => void }
) {
  const [updatedRevenue, setUpdatedRevenue] = useState<RevenueProps[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formRate, setFormRate] = useState({
    debit: 1.99,
    cashCredit: 4.99,
    installmentCredit: 5.59
  });

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
    setRevenue(updatedRevenue);
    updateRevenue();
  }

  const updateRevenue = async () => {
    setLoading(true);
    try {
      const updatedNetValues = updatedRevenue.map(item => ({
        id: item.id,
        net_value: item.net_value,
        release_date: item.release_date
      }));

      await axios.put(`${apiURL()}/update-net-values/`, updatedNetValues)
      setAlertMessage("Receita atualizada com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar receita.', error)
      setAlertMessage("Erro ao atualizar receita.");
    } finally {
      setLoading(false);
    }
  }

  const calculatedRevenue = useCallback((sortedRevenue: RevenueProps[]) => {
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
      } else {
        setUpdatedRevenue(orderedRevenue);
      }
    }
  }, [updatedRevenue, calculatedRevenue, orderedRevenue])

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

  if (loading) {
    return (
      <Loading>
        Salvando...
      </Loading>
    );
  }

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
      <div className={styles.overflow}>
        {updatedRevenue && updatedRevenue.length > 0 ?
          <>
            <table>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>{column.name}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {updatedRevenue.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => {
                      const isHighlighted = ["Débito", "Crédito à vista", "Crédito à prazo"].includes(row.payment);

                      return (
                        <td key={colIndex}>
                          {column.key === 'value' ? (
                            <span style={isHighlighted ? { color: 'red', fontWeight: 'bold' } : undefined}>
                              {formatValueToBRL(row[column.key])}
                            </span>
                          ) : column.key === 'payment' ? (
                            <span style={isHighlighted ? { color: 'red', fontWeight: 'bold' } : undefined}>
                              {row[column.key]}
                            </span>
                          ) : column.key === 'date' ? (
                            formatDate(row[column.key])
                          ) : column.key === 'release_date' ? (
                            getReleaseDate(row[column.key])
                          ) : column.key === 'net_value' ? (
                            <input
                              id="net-value"
                              name="net-value"
                              type="number"
                              className={styles.input}
                              onChange={(e) => handleInputChange(e, rowIndex)}
                              value={row.net_value}
                              min="0.001"
                              step="0.001"
                              required
                            />
                          ) : (
                            row[column.key]
                          )}
                        </td>
                      );
                    })}
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end w-full align-bottom my-3">
              <button className="btn green size-fit" onClick={saveRevenue}>
                Salvar
              </button>
            </div>
          </>
          : <div className="no-data">Nenhum resultado encontrado.</div>
        }
      </div>
      <Alert message={alertMessage} />
    </div>
  )
}