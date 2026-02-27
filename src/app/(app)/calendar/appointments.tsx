"use client";
import { useState } from "react";
import styles from "./Calendar.module.css";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import AppointmentForm from "./form";
import { formatDate } from "@/utils/date";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useAgenda } from "@/hooks/useAgenda";
import { Appointment, AppointmentsProps } from "@/types/agenda";


export default function Appointments({ time, patients }: AppointmentsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("view");
  const [selectedPatient, setSelectedPatient] = useState({
    id: 0,
    date: "",
    time: "",
    name: "",
    notes: ""
  });

  const { agenda, create, update, remove, fetch } = useAgenda([]);

  const openModal = (patient: Appointment): void => {
    setSelectedPatient(patient);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setDeleteModalIsOpen(false);
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
    if (!selectedPatient) return
    await remove(selectedPatient.id);
    closeModal();
  };

  const openDeleteModal = (): void => {
    setIsOpen(false);
    setDeleteModalIsOpen(true);
  };

  const shortName = (name: string): string => {
    if (name && name.length > 9) {
      return `${name.slice(0, 9)}..`
    } else {
      return name
    }
  };

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

      <Modal open={isOpen} onClose={closeModal}>
        <Modal.Header>
          Agendamento
        </Modal.Header>

        <Modal.Body>
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
              // setAgenda={setAgenda}
              closeModal={closeModal}
            />
          }
        </Modal.Body>

        {/* <Modal.Footer>
          // TODO: botões aqui. não no formulário
        </Modal.Footer> */}
      </Modal>

      <Modal open={deleteModalIsOpen} onClose={closeModal}>
          <Modal.Header>
            Excluir Agendamento
          </Modal.Header>

          <Modal.Body>
            Tem certeza que deseja excluir o agendamento do paciente <strong>{selectedPatient.name}</strong>?
          </Modal.Body>

          <Modal.Footer>
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
          </Modal.Footer>
        </Modal>
    </>
  );
}