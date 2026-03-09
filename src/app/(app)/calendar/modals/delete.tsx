"use client";

import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button__/button";
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
        <p className="text-base">
          Tem certeza que deseja excluir o agendamento 
          do(a) paciente <strong>{name}</strong>?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <div className="button-area">
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