
"use client";
import React, { useState, useEffect } from "react";
import { AgendaProps } from "@/types/agenda";
import { scheduleOptions } from "@/assets/data";
import { capitalize } from '@/utils/utils';
import { apiURL, fetchAgenda, isAuthenticated, configureAxios } from '@/utils/api';
import { useAlertStore } from '@/stores/alert.store';
import { Loading } from "@/components/Loading/Loading";
import axios from "axios";

interface AppointmentFormProps {
  selectedPatient?: AgendaProps;
  closeModal: () => void;
  setAgenda: (newAgenda: AgendaProps[]) => void;
}

export default function AppointmentForm({ selectedPatient, closeModal, setAgenda }: AppointmentFormProps) {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    id: 0,
    date: "",
    time: "",
    name: "",
    notes: ""
  });

  const alert = useAlertStore.getState();

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
      await updateAppointment(selectedPatient.id);
    } else {
      await createAppointment();
    }
  }

  const createAppointment = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${apiURL()}/agenda/create/`, formData);

      alert.show({
        message: "Agendamento criado com sucesso!",
        variant: "success",
      });

      const newAppointment = await fetchAgenda();
      setAgenda(newAppointment);
    } catch (error) {
      console.error('Erro ao criar agendamento.', error)

      alert.show({
        message: "Erro ao criar agendamento.",
        variant: "error",
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  }

  const updateAppointment = async (id: number) => {
    setIsLoading(true);
    try {
      await axios.patch(`${apiURL()}/agenda/${id}/`, formData);

      alert.show({
        message: "Agendamento atualizado com sucesso!",
        variant: "success",
      });

      const newAppointment = await fetchAgenda();
      setAgenda(newAppointment);
    } catch (error) {
      console.error('Erro ao atualizar agendamento.', error);

      alert.show({
        message: "Erro ao atualizar agendamento.",
        variant: "error",
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
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