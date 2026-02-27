
"use client";
import React, { useState, useEffect } from "react";
import { scheduleOptions } from "@/constants/appointment";
import { capitalize } from '@/utils/utils';
import { Button } from "@/components/button/button";
import { useAgenda } from "@/hooks/useAgenda";
import { Appointment, CreateAppointmentDTO, UpdateAppointmentDTO } from "@/types/agenda";

interface AppointmentFormProps {
  selectedPatient?: Appointment;
  closeModal: () => void;
}

export default function AppointmentForm({ selectedPatient, closeModal }: AppointmentFormProps) {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    id: 0,
    date: "",
    time: "",
    name: "",
    notes: ""
  });

  const { agenda, create, update, remove, fetch } = useAgenda([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "name") newValue = capitalize(value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const saveAppointment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedPatient && selectedPatient.id && selectedPatient.id > 0) {
      await updateAppointment(selectedPatient);
    } else {
      await createAppointment();
    }
  }

  const createAppointment = async () => {
    await create(formData);
    closeModal();
  };

  const updateAppointment = async (patient: UpdateAppointmentDTO) => {
    await update(patient);
    closeModal();
  };

  useEffect(() => {
    setFormData({
      id: selectedPatient?.id || 0,
      name: selectedPatient?.name || "",
      date: selectedPatient?.date || "",
      time: selectedPatient?.time || "",
      notes: selectedPatient?.notes || ""
    });
  }, [selectedPatient]);

  useEffect(() => {
    if (
      formData.name !== "" &&
      formData.date !== "" &&
      formData.time !== ""
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [formData]);

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
          value={formData.time} onChange={handleInputChange} required>
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
        <Button
          type="submit"
          label="Salvar"
          variant="primary"
          size="lg"
          disabled={!isFormValid}
        />
        <Button
          label="Cancelar"
          variant="secondary"
          size="md"
          onClick={closeModal}
        />
      </div>
    </form>
  )
}