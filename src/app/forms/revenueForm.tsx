"use client";
import React, { useState, useEffect } from "react";
import { procedureOptions, paymentOptions, installmentOptions } from '@/assets/data';
import { apiBase, fetchRevenue } from '@/utils/api';
import { useData } from "@/app/context/DataContext";
import Alert from '@/app/components/alert'
import axios from "axios";

interface RevenueRow {
  id?: number;
  date?: string;
  name?: string;
  cpf?: string;
  nf?: string;
  procedure?: string;
  payment?: string;
  installments?: number;
  value?: number;
  notes?: string;
}

interface RevenueFormProps {
  selectedRow?: RevenueRow;
  closeModal: () => void;
}

export default function RevenueForm({ selectedRow, closeModal }: RevenueFormProps) {
  const [showCpf, setShowCpf] = useState(false);
  const [showInstallments, setShowInstallments] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [validCPF, setValidCPF] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const { setRevenue } = useData();
  const [formData, setFormData] = useState({
    id: 0,
    date: "",
    name: "",
    cpf: "",
    nf: "no",
    procedure: "",
    payment: "",
    installments: 0,
    value: 0,
    notes: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "cpf") {
      newValue = formatCPF(value);
      if (!isValidCPF(value)) {
        console.error("CPF inválido");
        setValidCPF("CPF inválido");
      } else {
        setValidCPF("");
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const formatCPF = (cpf: string): string => {
    const numbers = cpf.replace(/\D/g, '');

    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const isValidCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const prepareDataForSubmission = (data: RevenueRow) => {
    return {
      ...data,
      nf: data.nf === "yes" ? true : false,
    };
  }

  const saveRevenue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedRow && selectedRow.id && selectedRow.id > 0) {
      await updateRevenue(selectedRow.id);
    } else {
      await createRevenue();
    }
  }

  const createRevenue = async () => {
    try {
      const preparedData = prepareDataForSubmission(formData);

      await axios.post(`${apiBase}/revenue/create/`, preparedData, {
        withCredentials: true
      })
      setAlertMessage("Receita criada com sucesso!");
      const newRevenue = await fetchRevenue();
      setRevenue(newRevenue)

      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      console.error('Erro ao criar receita.', error)
      setAlertMessage("Erro ao criar receita.");
    }
  }

  const updateRevenue = async (id: number) => {
    try {
      const preparedData = prepareDataForSubmission(formData);

      await axios.patch(`${apiBase}/revenue/${id}/`, preparedData, {
        withCredentials: true
      })
      setAlertMessage("Receita atualizada com sucesso!");
      const newRevenue = await fetchRevenue();
      setRevenue(newRevenue)

      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      console.error('Erro ao atualizar receita.', error)
      setAlertMessage("Erro ao atualizar receita.");
    }
  }

  useEffect(() => {
    if (formData) {
      if (formData.nf == "no") {
        setShowCpf(false)
      } else {
        setShowCpf(true)
      }

      if (formData.payment === "Crédito à prazo") {
        setShowInstallments(true)
      } else {
        setShowInstallments(false)
      }
    }
  }, [formData]);

  useEffect(() => {
    setFormData({
      id: selectedRow?.id || 0,
      date: selectedRow?.date || "",
      name: selectedRow?.name || "",
      cpf: selectedRow?.cpf || "",
      nf: selectedRow?.nf ? "yes" : "no" || "",
      procedure: selectedRow?.procedure || "",
      payment: selectedRow?.payment || "",
      installments: selectedRow?.installments || 0,
      value: selectedRow?.value || 0,
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
      formData.nf !== "" &&
      formData.procedure !== "" &&
      formData.payment !== "" &&
      formData.value !== 0
    ) {
      setIsFormValid(true);
      if (formData.cpf !== "") {
        if (isValidCPF(formData.cpf)) {
          setIsFormValid(true);
        } else {
          setIsFormValid(false);
        }
      }
    } else {
      setIsFormValid(false);
    }
  }, [formData])

  return (
    <>
      <form className="form-area" onSubmit={saveRevenue}>
        <div className="flex form-item">
          <label htmlFor="name" className="form-label">Nome:</label>
          <input id="name" name="name" type="text" className="form-input" value={formData.name}
            onChange={handleInputChange} required />
        </div>

        <div className="flex form-item">
          <label htmlFor="date" className="form-label">Data:</label>
          <input id="date" name="date" type="date" className="form-input" value={formData.date}
            onChange={handleInputChange} required />
        </div>

        <div className="flex form-item">
          <label className="form-label">Com nota fiscal?</label>
          <input id="nf-no" name="nf" type="radio" className="form-radio" value="no"
            checked={formData.nf == 'no'} onChange={handleInputChange} />
          <label htmlFor="nf-no" className="form-label">Não</label>
          <input id="nf-yes" name="nf" type="radio" className="form-radio" value="yes"
            checked={formData.nf == 'yes'} onChange={handleInputChange} />
          <label htmlFor="nf-yes" className="form-label">Sim</label>
        </div>

        {showCpf &&
          <div className="flex form-item">
            <label htmlFor="cfp" className="form-label">CPF:</label>
            <input id="cfp" name="cpf" type="text" className="form-input" value={formData.cpf}
              onChange={handleInputChange} maxLength={14} />
          </div>
        }
        {validCPF &&
          <p className="error">{validCPF}</p>
        }

        <div className="flex form-item">
          <label htmlFor="procedure" className="form-label">Procedimento:</label>
          <select id="procedure" name="procedure" className="form-select"
            value={formData.procedure} onChange={handleInputChange} required>
            <option value="" disabled>Selecione:</option>
            {procedureOptions.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="flex form-item">
          <label htmlFor="payment" className="form-label">Pagamento:</label>
          <select id="payment" name="payment" className="form-select"
            value={formData.payment} onChange={handleInputChange} required>
            <option value="" disabled>Selecione:</option>
            {paymentOptions.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {showInstallments &&
          <div className="flex form-item">
            <label htmlFor="installment" className="form-label">Número de parcelas:</label>
            <select id="installment" name="installments" className="form-select"
              value={formData.installments} onChange={handleInputChange}>
              {installmentOptions.map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
          </div>
        }

        <div className="flex form-item">
          <label htmlFor="value" className="form-label">Valor:</label>
          <input id="value" name="value" type="number" className="form-input"
            value={formData.value} onChange={handleInputChange} required />
        </div>

        <div className="flex form-item">
          <label htmlFor="notes" className="form-label">Notas:</label>
          <textarea id="notes" name="notes" className="form-textarea" value={formData.notes}
            onChange={handleInputChange} />
        </div>
        <div className="flex justify-around">
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