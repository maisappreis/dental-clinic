
"use client";
import React, { useState, useEffect } from "react";
import { PatientProps } from "@/types/appointment";
import { scheduleOptions } from "@/assets/data";
import { capitalize } from '@/utils/utils';

interface AppointmentFormProps {
  selectedPatient?: PatientProps;
  closeModal: () => void;
}

export default function AppointmentForm({ selectedPatient, closeModal }: AppointmentFormProps) {
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    date: "",
    time: "",
    name: "",
    notes: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "name") {
      newValue = capitalize(value);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  useEffect(() => {
    if (
      formData.name !== "" &&
      formData.date !== "" &&
      formData.time !== "" &&
      formData.notes !== ""
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [formData]);

  const saveAppointment = () => {
    console.log('Editar')
  }

  useEffect(() => {
    setFormData({
      id: selectedPatient?.id || 0,
      name: selectedPatient?.name || "",
      date: selectedPatient?.date || "",
      time: selectedPatient?.time || "",
      notes: selectedPatient?.notes || ""
    });
  }, [selectedPatient]);

  return (
    <form className="form-area" onSubmit={saveAppointment}>
      <div className="flex form-item">
        <label htmlFor="name" className="form-label">Paciente:</label>
        <input id="name" name="name" type="text" className="form-input" value={formData.name}
          onChange={handleInputChange} required />
      </div>

      <div className="flex form-item">
        <label htmlFor="date" className="form-label">Data:</label>
        <input id="date" name="date" type="date" className="form-input" value={formData.date}
          onChange={handleInputChange} required />
      </div>

      <div className="flex form-item">
        <label htmlFor="time" className="form-label">Horário:</label>
        <select id="time" name="time" className="form-select"
          value={formData.time} onChange={handleInputChange}>
          {scheduleOptions.map((option, i) => (
            <option key={i} value={option}>{option}</option>
          ))}
        </select>
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
  )
}