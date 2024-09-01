"use client";
import { useState } from "react";
import styles from "./Calendar.module.css";
import Modal from "@/app/components/modal";
import { formatDate } from "@/utils/date";

interface PatientProps {
  date: string;
  time: string;
  name: string;
  notes: string;
}

interface AppointmentsProps {
  time: string;
  patients: PatientProps[];
}

export default function Appointments({ time, patients }: AppointmentsProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedPatient, setSelectedPatient] = useState({
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
    setSelectedPatient({
      date: "",
      time: "",
      name: "",
      notes: ""
    });
  };

  const saveAppointment = () => {
    console.log('Salvar')
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
          <div className="my-5 text-left">
            <h3 className="mb-3">Dia: <strong>{formatDate(selectedPatient.date)}</strong></h3>
            <h3 className="mb-3">Horário: <strong>{selectedPatient.time}</strong></h3>
            <h3>Paciente: <strong>{selectedPatient.name}</strong></h3>
            <p className="my-4">{selectedPatient.notes}</p>
          </div>
          <div className="flex justify-around">
            <button onClick={saveAppointment} className="btn orange size">
              Editar
            </button>
            <button onClick={closeModal} className="btn red size blue">
              Fechar
            </button>
          </div>
        </Modal>
      }
    </>
  );
}