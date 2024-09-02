"use client";
import { useState } from "react";
import styles from "./Calendar.module.css";
import Modal from "@/app/components/modal";
import AppointmentForm from "./form";
import { formatDate } from "@/utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { PatientProps, AppointmentsProps } from "@/types/appointment";

export default function Appointments({ time, patients }: AppointmentsProps) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalTitle, setDeleteModalTitle] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [mode, setMode] = useState('view');
  const [selectedPatient, setSelectedPatient] = useState({
    id: 0,
    date: "",
    time: "",
    name: "",
    notes: ""
  });

  const openModal = (patient: PatientProps): void => {
    if (patient.name !== "") {
      setSelectedPatient(patient);
      console.log('patient', patient)
    }
    setShowModal(true);
    setModalTitle("Agendamento");
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setSelectedPatient({
      id: 0,
      date: "",
      time: "",
      name: "",
      notes: ""
    });
  };

  const updateAppointment = () => {
    setMode("update")
  };

  const deleteAppointment = () => {
    console.log('Excluir')
  };

  const openDeleteModal = (): void => {
    setShowModal(false);
    setShowDeleteModal(true);
    setDeleteModalTitle("Excluir Agendamento")
  }

  return (
    <>
      <div className={`${styles.schedule} ${styles.blue} ${styles.text}`}>{time}</div>
      {patients.map((patient, index) => (
        <button key={index} className={`${styles.schedule} ${styles.graylight}`} onClick={() => openModal(patient)}>
          <div className="flex justify-center">
            <p className={`${styles.text}`}>{patient.name}</p>
          </div>
        </button>
      ))}

      {showModal &&
        <Modal title={modalTitle}>
          {mode === "view" ?
            <div>
              <div className="my-5 text-left">
                <h3 className="mb-3">Paciente: <strong>{selectedPatient.name}</strong></h3>
                <h3 className="mb-3">Dia: <strong>{formatDate(selectedPatient.date)}</strong></h3>
                <h3 className="mb-3">Horário: <strong>{selectedPatient.time}</strong></h3>
                <p className="my-4">{selectedPatient.notes}</p>
              </div>
              <div className="flex justify-center">
                <button onClick={updateAppointment} className="btn orange size-fit mr-3">
                  <FontAwesomeIcon icon={faPenToSquare} className="table-icon" />
                </button>
                <button onClick={openDeleteModal} className="btn red size-fit mr-3">
                  <FontAwesomeIcon icon={faTrashCan} className="table-icon" />
                </button>
                <button onClick={closeModal} className="btn red size blue">
                  Fechar
                </button>
              </div>
            </div>
            :
            <AppointmentForm selectedPatient={selectedPatient} closeModal={closeModal} />
          }
        </Modal>
      }
      {showDeleteModal &&
        <Modal title={deleteModalTitle}>
          <div className="my-5 text-center">
            Tem certeza que deseja excluir o agendamento do paciente <strong>{selectedPatient.name}</strong>?
          </div>
          <div className="flex justify-around">
            <button onClick={deleteAppointment} className="btn red size">
              Excluir
            </button>
            <button onClick={closeModal} className="btn size blue">
              Cancelar
            </button>
          </div>
        </Modal>
      }
    </>
  );
}