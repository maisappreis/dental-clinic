"use client";
import React, { useState, useEffect } from "react";
import { apiURL, fetchExpenses, isAuthenticated, configureAxios } from '@/utils/api';
import { capitalize } from '@/utils/utils';
import { getMonthAndYear } from "@/utils/date";
import { ExpenseProps } from '@/types/expense';
import { useAlertStore } from '@/stores/alert.store';
import { Loading } from "@/components/Loading/Loading";
import axios from "axios";

interface ExpenseFormProps {
  selectedRow?: ExpenseProps;
  closeModal: () => void;
  setExpenses: (newExpenses: any[]) => void;
}

export default function ExpenseForm(
    {selectedRow, closeModal, setExpenses }: ExpenseFormProps
  ) {
  const [hasInstallments, setHasInstallments] = useState<boolean>(false);
  const [validInstallments, setValidInstallments] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
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

  const { showAlert } = useAlertStore();

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
    setIsLoading(true);
    try {
      const preparedData = prepareDataForSubmission(formData);

      await axios.post(`${apiURL()}/expense/create/`, preparedData)

      showAlert({
        message: "Despesa criada com sucesso!",
        variant: "success",
        autoCloseAfter: 2000,
      });
      const newExpense = await fetchExpenses();
      setExpenses(newExpense)
    } catch (error) {
      console.error('Erro ao criar despesa.', error)
      showAlert({
        message: "Erro ao criar despesa.",
        variant: "error",
        autoCloseAfter: 2000,
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  }

  const updateExpense = async (id: number) => {
    setIsLoading(true);
    try {
      const preparedData = prepareDataForSubmission(formData);

      await axios.patch(`${apiURL()}/expense/${id}/`, preparedData)

      showAlert({
        message: "Despesa atualizada com sucesso!",
        variant: "success",
        autoCloseAfter: 2000,
      });
      const newExpense = await fetchExpenses();
      setExpenses(newExpense)
    } catch (error) {
      console.error('Erro ao atualizar despesa.', error)

      showAlert({
        message: "Erro ao atualizar despesa.",
        variant: "error",
        autoCloseAfter: 2000,
      });
    } finally {
      closeModal();
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <Loading
        label="Salvando..."
      />
    );
  }
  
  return (
    <>
      <form className="form-area" onSubmit={saveExpense}>
        <div className="form-item">
          <label htmlFor="name" className="form-label">Nome:</label>
          <input id="name" name="name" type="text" className="form-input" value={formData.name}
            onChange={handleInputChange} required />
        </div>

        <div className="form-item">
          <label htmlFor="date" className="form-label">Data de Vencimento:</label>
          <input id="date" name="date" type="date" className="form-input" value={formData.date}
            onChange={handleInputChange} required />
        </div>

        <div className="flex mt-3">
          <label htmlFor="has-installments" className="form-label">Possui parcelas?</label>
          <input id="has-installments" name="has-installments" type="checkbox" className="form-radio"
            checked={hasInstallments} onChange={(e) => {
              const checked = (e.target as HTMLInputElement).checked;
              setHasInstallments(checked);
            }}
          />
        </div>

        {hasInstallments &&
          <div className="form-item">
            <label htmlFor="installment" className="form-label">Número de parcelas:</label>
            <input id="installments" name="installments" type="text" className="form-input"
              value={formData.installments} onChange={handleInputChange} />
          </div>
        }
        {hasInstallments && validInstallments &&
          <p className="error">{validInstallments}</p>
        }

        <div className="form-item">
          <label htmlFor="value" className="form-label">Valor:</label>
          <input id="value" name="value" type="number" className="form-input"
            value={formData.value} onChange={handleInputChange} min="0.001" step="0.001" required />
        </div>

        <div className="form-item">
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
    </>
  )
}