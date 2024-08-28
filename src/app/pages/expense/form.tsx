"use client";
import React, { useState, useEffect } from "react";
import { apiURL, fetchExpenses, isAuthenticated, configureAxios } from '@/utils/api';
import { capitalize } from '@/utils/utils';
import { getMonthAndYear } from "@/utils/date";
import Alert from '@/app/components/alert'
import axios from "axios";
import { ExpenseProps } from '@/types/expense';

interface ExpenseFormProps {
  selectedRow?: ExpenseProps;
  closeModal: () => void;
  setExpenses: (newExpenses: any[]) => void;
}

export default function ExpenseForm({ selectedRow, closeModal, setExpenses }: ExpenseFormProps) {
  const [hasInstallments, setHasInstallments] = useState(false);
  const [validInstallments, setValidInstallments] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    year: 0,
    month: "",
    name: "",
    installments: "",
    date: "",
    value: 0,
    is_paid: false,
    notes: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "installments") {
      if (hasInstallments) {
        if (!isValidInstallments(value)) {
          console.error("Parcelas inválidas");
          setValidInstallments("Parcelas inválidas");
        } else {
          newValue = value;
          setValidInstallments("");
        }
      } else {
        newValue = "";
        setValidInstallments("");
      }
    }

    if (!hasInstallments) setValidInstallments("")

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const isValidInstallments = (installment: string): boolean => {
    const integerNumber = parseInt(installment);
    return Number.isInteger(integerNumber);
  };

  const prepareDataForSubmission = (data: ExpenseProps) => {
    if (data.date) {
      const [month, year] = getMonthAndYear(data.date);
      return {
        ...data,
        month,
        year: parseInt(year),
        name: capitalize(data.name),
      };
    } else {
      return {
        ...data,
        name: capitalize(data.name),
      };
    }
  }

  const saveExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedRow && selectedRow.id && selectedRow.id > 0) {
      await updateExpense(selectedRow.id);
    } else {
      await createExpense();
    }
  }

  const createExpense = async () => {
    try {
      const preparedData = prepareDataForSubmission(formData);

      await axios.post(`${apiURL()}/expense/create/`, preparedData, {
        withCredentials: true
      })
      setAlertMessage("Despesa criada com sucesso!");
      const newExpense = await fetchExpenses();
      setExpenses(newExpense)

      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      console.error('Erro ao criar despesa.', error)
      setAlertMessage("Erro ao criar despesa.");
    }
  }

  const updateExpense = async (id: number) => {
    try {
      const preparedData = prepareDataForSubmission(formData);

      await axios.patch(`${apiURL()}/expense/${id}/`, preparedData, {
        withCredentials: true
      })
      setAlertMessage("Despesa atualizada com sucesso!");
      const newExpense = await fetchExpenses();
      setExpenses(newExpense)

      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      console.error('Erro ao atualizar despesa.', error)
      setAlertMessage("Erro ao atualizar despesa.");
    }
  }

  useEffect(() => {
    setFormData({
      id: selectedRow?.id || 0,
      year: selectedRow?.year || 0,
      month: selectedRow?.month || "",
      name: selectedRow?.name || "",
      installments: selectedRow?.installments || "",
      date: selectedRow?.date || "",
      value: selectedRow?.value || 0,
      is_paid: selectedRow?.is_paid || false,
      notes: selectedRow?.notes || ""
    });
  }, [selectedRow]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("")
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  useEffect(() => {
    if (
      formData.date !== "" &&
      formData.name !== "" &&
      formData.value !== 0
    ) {
      setIsFormValid(true);
      if (hasInstallments) {
        if (formData.installments !== "") {
          setIsFormValid(true);
        } else {
          setIsFormValid(false);
        }
      }
    } else {
      setIsFormValid(false);
    }
  }, [formData, hasInstallments])

  useEffect(() => {
    isAuthenticated();
    configureAxios();
  }, []);

  return (
    <>
      <form className="form-area" onSubmit={saveExpense}>
        <div className="flex form-item">
          <label htmlFor="name" className="form-label">Nome:</label>
          <input id="name" name="name" type="text" className="form-input" value={formData.name}
            onChange={handleInputChange} required />
        </div>

        <div className="flex form-item">
          <label htmlFor="date" className="form-label">Data de Vencimento:</label>
          <input id="date" name="date" type="date" className="form-input" value={formData.date}
            onChange={handleInputChange} required />
        </div>

        <div className="flex form-item">
          <label htmlFor="has-installments" className="form-label">Possui parcelas?</label>
          <input id="has-installments" name="has-installments" type="checkbox" className="form-radio"
            checked={hasInstallments} onChange={(e) => {
              const checked = (e.target as HTMLInputElement).checked;
              setHasInstallments(checked);
            }}
          />
        </div>

        {hasInstallments &&
          <div className="flex form-item">
            <label htmlFor="installment" className="form-label">Número de parcelas:</label>
            <input id="installments" name="installments" type="text" className="form-input"
              value={formData.installments} onChange={handleInputChange} />
          </div>
        }
        {hasInstallments && validInstallments &&
          <p className="error">{validInstallments}</p>
        }

        <div className="flex form-item">
          <label htmlFor="value" className="form-label">Valor:</label>
          <input id="value" name="value" type="number" className="form-input"
            value={formData.value} onChange={handleInputChange} min="0.001" step="0.001" required />
        </div>

        <div className="flex form-item">
          <label htmlFor="notes" className="form-label">Notas:</label>
          <textarea id="notes" name="notes" className="form-textarea" value={formData.notes}
            onChange={handleInputChange} />
        </div>
        <div className="flex justify-around mt-3">
          <button className="btn green size" type="submit" disabled={!isFormValid}>
            Salvar
          </button>
          <button onClick={closeModal} className="btn red size">
            Cancelar
          </button>
        </div>
      </form>
      <Alert message={alertMessage} />
    </>
  )
}