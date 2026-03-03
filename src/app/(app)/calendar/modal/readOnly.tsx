"use client";

import React from "react";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { formatDate } from "@/utils/date";
import { Appointment, SelectedAppointment } from "@/types/agenda";


interface ReadOnlyModalProps {
  open: boolean;
  appointment: SelectedAppointment;
  onClose: () => void;
  onUpdate: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
}

export function ReadOnlyModal({
  open,
  appointment,
  onClose,
  onUpdate,
  onDelete,
}: ReadOnlyModalProps) {

  if (appointment.mode !== "view") return null;

  const { name } = appointment.appointment;
  const { date } = appointment.appointment;
  const { time } = appointment.appointment;
  const { notes } = appointment.appointment;

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
          Agendamento
      </Modal.Header>

      <Modal.Body>
        <div>
          <div className="my-5 text-left">
            <h3 className="mb-3">
              Paciente: <strong>{name}</strong>
            </h3>
            <h3 className="mb-3">
              Dia: <strong>{formatDate(date)}</strong>
            </h3>
            <h3 className="mb-3">
              Horário: <strong>{time}</strong>
            </h3>
            <p className="my-4">
              Observações: {notes}
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-center">
          <Button
            label="Editar"
            variant="primary"
            size="md"
            icon={faPenToSquare}
            onClick={() => onUpdate(appointment.appointment)}
          />
          <Button
            label="Excluir"
            variant="danger"
            size="md"
            icon={faTrashCan}
            onClick={() => onDelete(appointment.appointment)}
          />
          <Button
            label="Cancelar"
            variant="secondary"
            size="md"
            onClick={onClose}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};