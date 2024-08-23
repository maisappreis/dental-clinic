"use client";
import React, { useRef, useState, useEffect } from "react";

interface ExpenseRow {
  id: number;
  year: number;
  month: string;
  name: string;
  installments: string;
  date: string;
  value: number;
  is_paid: boolean;
  notes: string;
}

interface ExpenseFormProps {
  selectedRow?: ExpenseRow;
  onSubmit: (data: any) => void;
  formRef: React.RefObject<HTMLFormElement>;
}

export default function ExpenseForm({ selectedRow, onSubmit, formRef }: ExpenseFormProps) {
  const [hasInstallments, setHasInstallments] = useState(false);

  const [formData, setFormData] = useState({
    id: selectedRow?.id,
    year: selectedRow?.year,
    month: selectedRow?.month,
    name: selectedRow?.name,
    installments: selectedRow?.installments,
    date: selectedRow?.date,
    value: selectedRow?.value,
    is_paid: selectedRow?.is_paid,
    notes: selectedRow?.notes
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;

    if (type === 'checkbox') {
      setHasInstallments(!hasInstallments);
    } else {
      // Continue tratando os outros tipos de inputs
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // TODO: Não precisamos de um FormData para enviar os dado para a API
    onSubmit(formData);
  };

  const setInstallments = () => {
    setHasInstallments(true);
  }

  useEffect(() => {
    if (selectedRow) {
      setFormData({
        id: selectedRow.id,
        year: selectedRow.year,
        month: selectedRow.month,
        name: selectedRow.name,
        installments: selectedRow.installments,
        date: selectedRow.date,
        value: selectedRow.value,
        is_paid: selectedRow?.is_paid,
        notes: selectedRow.notes
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
          <label htmlFor="date" className="form-label">Data de Vencimento:</label>
          <input id="date" name="date" type="date" className="form-input" value={formData.date}
            onChange={handleInputChange} required />
        </div>

        <div className="flex form-item">
          <label htmlFor="has-installments" className="form-label">Possui parcelas?</label>
          <input id="has-installments" name="has-installments" type="checkbox" className="form-radio"
            checked={hasInstallments} onChange={handleInputChange} />
        </div>

        { hasInstallments &&
          <div className="flex form-item">
            <label htmlFor="installment" className="form-label">Número de parcelas:</label>
            <input id="installment" name="installment" type="text" className="form-input"
              value={formData.installments} onChange={handleInputChange} />
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