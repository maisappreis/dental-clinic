"use client";

import React from "react";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { SelectedAppointment } from "@/types/agenda";


interface DeleteModalProps {
  open: boolean;
  appointment: SelectedAppointment;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteModal({
  open,
  appointment,
  onClose,
  onDelete,
}: DeleteModalProps) {

  if (appointment.mode !== "view") return null;

  const { name } = appointment.appointment;

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        Excluir Agendamento
      </Modal.Header>

      <Modal.Body>
        Tem certeza que deseja excluir o agendamento 
        do paciente <strong>{name}</strong>?
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-around">
          <Button
            label="Excluir"
            variant="danger"
            size="md"
            onClick={onDelete}
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