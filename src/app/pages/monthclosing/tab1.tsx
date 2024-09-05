"use client";
import React, { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/utils/date";
import { RevenueProps, RevenueList } from '@/types/revenue';
import axios from "axios";
import Alert from '@/app/components/alert';
import { apiURL, isAuthenticated, configureAxios } from '@/utils/api';
import styles from "./MonthClosing.module.css";

export default function TabOne(
  { revenue, setRevenue }: { revenue: RevenueList, setRevenue: (newRevenue: RevenueProps[]) => void; }
) {
  const [updatedRevenue, setUpdatedRevenue] = useState<RevenueList>([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [formRate, setFormRate] = useState({
    debit: 1.99,
    cashCredit: 4.99,
    installmentCredit: 5.59
  });

  const columns: { key: string; name: string; }[] = [
    { key: "date", name: "Data" },
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
    try {
      const updatedNetValues = updatedRevenue.map(item => ({
        id: item.id,
        net_value: item.net_value
      }));

      await axios.put(`${apiURL()}/update-net-values/`, updatedNetValues)
      setAlertMessage("Receita atualizada com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar receita.', error)
      setAlertMessage("Erro ao atualizar receita.");
    }
  }

  const calculatedRevenue = useCallback((sortedRevenue: RevenueList) => {
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

  useEffect(() => {
    if (revenue && revenue.length > 0 && updatedRevenue.length === 0) { 
      const priorityPayments = ["Débito", "Crédito à vista", "Crédito à prazo"];

      const prioritizedRevenue = revenue.filter(item => 
        priorityPayments.includes(item.payment)
      );
      
      const otherRevenue = revenue.filter(item => 
        !priorityPayments.includes(item.payment)
      );

      prioritizedRevenue.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      const sortedRevenue = [...prioritizedRevenue, ...otherRevenue];

      const allNetValuesZero = revenue.every(item => item.net_value === 0);
  
      if (allNetValuesZero) {
        const updatedRevenueData = calculatedRevenue(sortedRevenue);
        setUpdatedRevenue(updatedRevenueData);
      } else {
        setUpdatedRevenue(sortedRevenue);
      }
    }
  }, [revenue, formRate, calculatedRevenue, updatedRevenue.length]);

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
        {updatedRevenue.length > 0 ?
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
                      const formattedValue = `R$ ${parseFloat(row[column.key]).toFixed(2).replace('.', ',')}`;

                      return (
                        <td key={colIndex}>
                          {column.key === 'value' ? (
                            <span style={isHighlighted ? { color: 'red', fontWeight: 'bold' } : undefined}>
                              {formattedValue}
                            </span>
                          ) : column.key === 'payment' ? (
                            <span style={isHighlighted ? { color: 'red', fontWeight: 'bold' } : undefined}>
                              {row[column.key]}
                            </span>
                          ) : column.key === 'date' ? (
                            formatDate(row[column.key])
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