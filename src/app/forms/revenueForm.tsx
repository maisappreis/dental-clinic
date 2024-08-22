"use client";
import React, { useRef, useState, useEffect } from "react";
import { procedureOptions, paymentOptions, installmentOptions } from '@/assets/data';

interface RevenueRow {
  id: number;
  date: string;
  name: string;
  cpf: string;
  nf: string;
  procedure: string;
  payment: string;
  installments: number;
  value: number;
  notes: string;
}

interface RevenueFormProps {
  selectedRow?: RevenueRow;
  onSubmit: (data: any) => void;
  formRef: React.RefObject<HTMLFormElement>;
}

export default function RevenueForm({ selectedRow, onSubmit, formRef }: RevenueFormProps) {
  const [showCpf, setShowCpf] = useState(false);
  const [showInstallments, setShowInstallments] = useState(false);

  const [formData, setFormData] = useState({
    id: selectedRow?.id,
    date: selectedRow?.date,
    name: selectedRow?.name || '',
    cpf: selectedRow?.cpf || '',
    nf: selectedRow?.nf || false,
    procedure: selectedRow?.procedure || "",
    payment: selectedRow?.payment || "",
    installments: selectedRow?.installments || 0,
    value: selectedRow?.value || 0,
    notes: selectedRow?.notes || ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
   
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // TODO: Não precisamos de um FormData para enviar os dado para a API
    onSubmit(formData);
  };

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
    if (selectedRow) {
      setFormData({
        id: selectedRow.id,
        date: selectedRow.date,
        name: selectedRow.name,
        cpf: selectedRow.cpf,
        nf: selectedRow.nf,
        procedure: selectedRow.procedure,
        payment: selectedRow.payment,
        installments: selectedRow.installments,
        value: selectedRow.value,
        notes: selectedRow.notes,
      });
    }
  }, [selectedRow]);

  return (
    <>
      <form className="form-area" ref={formRef} onSubmit={handleSubmit}>
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

        { showCpf &&
          <div className="flex form-item">
          <label htmlFor="cfp" className="form-label">CPF:</label>
          <input id="cfp" name="cpf" type="text" className="form-input" value={formData.cpf}
            onChange={handleInputChange} />
        </div>
        }

        <div className="flex form-item">
          <label htmlFor="procedure" className="form-label">Procedimento:</label>
          <select id="procedure" name="procedure" className="form-select"
            value={formData.procedure} onChange={handleInputChange}>
            {procedureOptions.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="flex form-item">
          <label htmlFor="payment" className="form-label">Pagamento:</label>
          <select id="payment"name="payment" className="form-select"
            value={formData.payment} onChange={handleInputChange}>
            {paymentOptions.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        </div>

        { showInstallments &&
          <div className="flex form-item">
            <label htmlFor="installment" className="form-label">Número de parcelas:</label>
            <select id="installment"name="installments" className="form-select"
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
          value={formData.value} onChange={handleInputChange} />
        </div>

        <div className="flex form-item">
          <label htmlFor="notes" className="form-label">Notas:</label>
          <textarea id="notes" name="notes" className="form-textarea" value={formData.notes}
            onChange={handleInputChange} />
        </div>
      </form>
    </>
  )
}