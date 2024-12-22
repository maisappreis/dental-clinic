"use client";
import React, { useState, useEffect } from "react";
import { procedureOptions, paymentOptions, installmentOptions } from '@/assets/data';
import { apiURL, fetchRevenue, isAuthenticated, configureAxios } from '@/utils/api';
import { getCurrentDate } from "@/utils/date";
import { capitalize } from '@/utils/utils';
import axios from "axios";
import { RevenueProps } from '@/types/revenue';
import Loading from "@/app/common/loading";

interface RevenueFormProps {
  selectedRow?: RevenueProps;
  closeModal: () => void;
  setRevenue: (newRevenue: any[]) => void;
  setAlertMessage: (newAlert: string) => void;
}

export default function RevenueForm({ selectedRow, closeModal, setRevenue, setAlertMessage }: RevenueFormProps) {
  const [showCpf, setShowCpf] = useState<boolean>(false);
  const [showInstallments, setShowInstallments] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [validCPF, setValidCPF] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [formData, setFormData] = useState<RevenueProps>({
    id: 0,
    date: getCurrentDate(),
    release_date: getCurrentDate(),
    name: "",
    cpf: "",
    nf: "no",
    procedure: "",
    payment: "",
    installments: 0,
    value: 0,
    net_value: 0,
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

    if (name === "nf" && value === "no") setValidCPF("");

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

  const prepareDataForSubmission = (data: RevenueProps) => {
    return {
      ...data,
      nf: data.nf === "yes" ? true : false,
      name: capitalize(data.name),
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
    setLoading(true);
    try {
      const preparedData = prepareDataForSubmission(formData);

      await axios.post(`${apiURL()}/revenue/create/`, preparedData)
      setAlertMessage("Receita criada com sucesso!");
      const newRevenue = await fetchRevenue();
      setRevenue(newRevenue)
    } catch (error) {
      console.error('Erro ao criar receita.', error)
      setAlertMessage("Erro ao criar receita.");
    } finally {
      closeModal();
      setLoading(false);
    }
  }

  const updateRevenue = async (id: number) => {
    setLoading(true);
    try {
      const preparedData = prepareDataForSubmission(formData);

      await axios.patch(`${apiURL()}/revenue/${id}/`, preparedData)
      setAlertMessage("Receita atualizada com sucesso!");
      const newRevenue = await fetchRevenue();
      setRevenue(newRevenue)
    } catch (error) {
      console.error('Erro ao atualizar receita.', error)
      setAlertMessage("Erro ao atualizar receita.");
    } finally {
      closeModal();
      setLoading(false);
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
      date: selectedRow?.date || getCurrentDate(),
      release_date: selectedRow?.release_date || getCurrentDate(),
      name: selectedRow?.name || "",
      cpf: selectedRow?.cpf || "",
      nf: selectedRow?.nf ? "yes" : "no",
      procedure: selectedRow?.procedure || "",
      payment: selectedRow?.payment || "",
      installments: selectedRow?.installments || 0,
      value: selectedRow?.value || 0,
      net_value: selectedRow?.net_value || 0,
      notes: selectedRow?.notes || ""
    });
  }, [selectedRow]);

  useEffect(() => {
    if (
      formData.date !== "" &&
      formData.name !== "" &&
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
  }, [formData]);

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
    <>
      <form className="form-area" onSubmit={saveRevenue}>
        <div className="form-item">
          <label htmlFor="name" className="form-label">Nome:</label>
          <input id="name" name="name" type="text" className="form-input" value={formData.name}
            onChange={handleInputChange} required />
        </div>

        <div className="form-item">
          <label htmlFor="date" className="form-label">Data:</label>
          <input id="date" name="date" type="date" className="form-input" value={formData.date}
            onChange={handleInputChange} required />
        </div>

        <div className="form-item">
          <label className="form-label">Com nota fiscal?</label>
          <div className="flex">
            <input id="nf-no" name="nf" type="radio" className="form-radio" value="no"
              checked={formData.nf === 'no'} onChange={handleInputChange} />
            <label htmlFor="nf-no" className="form-label">Não</label>
            <input id="nf-yes" name="nf" type="radio" className="form-radio" value="yes"
              checked={formData.nf === 'yes'} onChange={handleInputChange} />
            <label htmlFor="nf-yes" className="form-label">Sim</label>
          </div>
        </div>

        {showCpf &&
          <div className="form-item">
            <label htmlFor="cfp" className="form-label">CPF:</label>
            <input id="cfp" name="cpf" type="text" className="form-input" value={formData.cpf}
              onChange={handleInputChange} maxLength={14} />
          </div>
        }
        {validCPF &&
          <p className="error">{validCPF}</p>
        }

        <div className="form-item">
          <label htmlFor="procedure" className="form-label">Procedimento:</label>
          <select id="procedure" name="procedure" className="form-select"
            value={formData.procedure} onChange={handleInputChange} required>
            <option value="" disabled>Selecione:</option>
            {procedureOptions.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-item">
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
          <div className="form-item">
            <label htmlFor="installments" className="form-label">Número de parcelas:</label>
            <select id="installments" name="installments" className="form-select"
              value={formData.installments} onChange={handleInputChange}>
              {installmentOptions.map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
          </div>
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