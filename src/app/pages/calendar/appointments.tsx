"use client";
import { useState, useEffect } from "react";
import styles from "./Calendar.module.css";
import Modal from "@/app/common/modal";
import AppointmentForm from "./form";
import Loading from "@/app/common/loading";
import { formatDate } from "@/utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { AgendaProps, AppointmentsProps } from "@/types/agenda";
import Alert from '@/app/common/alert'
import axios from "axios";
import { apiURL, fetchAgenda, isAuthenticated, configureAxios } from '@/utils/api';

export default function Appointments({ time, patients, setAgenda }: AppointmentsProps) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalTitle, setDeleteModalTitle] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [mode, setMode] = useState('view');
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState({
    id: 0,
    date: "",
    time: "",
    name: "",
    notes: ""
  });

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
    setLoading(true);
    try {
      if (selectedPatient && selectedPatient.id) {
        await axios.delete(`${apiURL()}/agenda/${selectedPatient.id}/`)

        setAlertMessage("Agendamento excluído com sucesso!");
        const newAppointment = await fetchAgenda();
        setAgenda(newAppointment);

        setTimeout(() => {
          closeModal();
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao excluir agendamento.', error)
      setAlertMessage("Erro ao excluir agendamento.");
    } finally {
      setLoading(false);
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
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("")
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  useEffect(() => {
    isAuthenticated();
    configureAxios();
  }, []);

  if (loading) {
    return (
      <Loading>
        Excluindo...
      </Loading>
    );
  }

  return (
    <>
      <div className={`${styles.schedule} ${styles.blue} ${styles.text}`}>{time}</div>
      {patients.map((patient, index) => (
        <button key={index} className={`${styles.schedule} ${styles.graylight}`} onClick={() => openModal(patient)}>
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
            <AppointmentForm selectedPatient={selectedPatient} setAgenda={setAgenda} closeModal={closeModal} />
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
      <Alert message={alertMessage} />
    </>
  );
}