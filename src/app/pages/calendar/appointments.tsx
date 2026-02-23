"use client";
import { useState, useEffect } from "react";
import styles from "./Calendar.module.css";
import Modal from "@/app/common/modal";
import AppointmentForm from "./form";
import { Loading } from "@/components/Loading/Loading";
import { formatDate } from "@/utils/date";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { AgendaProps, AppointmentsProps } from "@/types/agenda";
import { apiURL, fetchAgenda, isAuthenticated, configureAxios } from "@/utils/api";
import { useAlertStore } from "@/stores/alert.store";
import { Button } from "@/components/Button/Button";
import axios from "axios";

export default function Appointments({ time, patients, setAgenda }: AppointmentsProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteModalTitle, setDeleteModalTitle] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [mode, setMode] = useState<string>("view");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState({
    id: 0,
    date: "",
    time: "",
    name: "",
    notes: ""
  });

  const alert = useAlertStore.getState();

  const openModal = (patient: AgendaProps): void => {
    setSelectedPatient(patient);
    setShowModal(true);
    setModalTitle("Agendamento");
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setMode("view");
    setSelectedPatient({
      id: 0,
      date: "",
      time: "",
      name: "",
      notes: ""
    });
  };

  const updateAppointment = () => {
    setMode("update");
  };

  const deleteAppointment = async () => {
    setIsLoading(true);
    try {
      if (selectedPatient && selectedPatient.id) {
        await axios.delete(`${apiURL()}/agenda/${selectedPatient.id}/`)

        alert.show({
          message: "Agendamento excluído com sucesso!",
          variant: "success",
        });

        const newAppointment = await fetchAgenda();
        setAgenda(newAppointment);
      }
    } catch (error) {
      alert.show({
        message: "Erro ao excluir agendamento.",
        variant: "error",
      });
    } finally {
      closeModal();
      setIsLoading(false);
    }
  };

  const openDeleteModal = (): void => {
    setShowModal(false);
    setShowDeleteModal(true);
    setDeleteModalTitle("Excluir Agendamento")
  }

  const shortName = (name: string): string => {
    if (name && name.length > 9) {
      return `${name.slice(0, 9)}..`
    } else {
      return name
    }
  }

  useEffect(() => {
    isAuthenticated();
    configureAxios();
  }, []);

  if (isLoading) {
    return (
      <Loading
        label="Excluindo agendamento..."
      />
    );
  }

  return (
    <>
      <div className={`${styles.schedule} ${styles.blue} ${styles.text}`}>{time}</div>
      {patients.map((patient, index) => (
        <button key={index}
          className={`${styles.schedule} ${styles.graylight}`}
          onClick={() => openModal(patient)}>
          <div className="flex justify-center">
            <p className={`${styles.text}`}>{shortName(patient.name)}</p>
          </div>
        </button>
      ))}

      {showModal &&
        <Modal title={modalTitle}>
          {mode === "view" && selectedPatient.name ?
            <div>
              <div className="my-5 text-left">
                <h3 className="mb-3">Paciente: <strong>{selectedPatient.name}</strong></h3>
                <h3 className="mb-3">Dia: <strong>{formatDate(selectedPatient.date)}</strong></h3>
                <h3 className="mb-3">Horário: <strong>{selectedPatient.time}</strong></h3>
                <p className="my-4">{selectedPatient.notes}</p>
              </div>
              <div className="flex justify-center">
                <Button
                  label="Editar"
                  variant="primary"
                  size="md"
                  icon={faPenToSquare}
                  onClick={updateAppointment}
                />
                <Button
                  label="Excluir"
                  variant="danger"
                  size="md"
                  icon={faTrashCan}
                  onClick={openDeleteModal}
                />
                <Button
                  label="Cancelar"
                  variant="secondary"
                  size="md"
                  onClick={closeModal}
                />
              </div>
            </div>
            :
            <AppointmentForm
              selectedPatient={selectedPatient}
              setAgenda={setAgenda}
              closeModal={closeModal}
            />
          }
        </Modal>
      }
      {showDeleteModal &&
        <Modal title={deleteModalTitle}>
          <div className="my-5 text-center">
            Tem certeza que deseja excluir o agendamento do paciente <strong>{selectedPatient.name}</strong>?
          </div>
          <div className="flex justify-around">
            <Button
              label="Excluir"
              variant="danger"
              size="md"
              onClick={deleteAppointment}
            />
            <Button
              label="Cancelar"
              variant="secondary"
              size="md"
              onClick={closeModal}
            />
          </div>
        </Modal>
      }
    </>
  );
}