"use client";

import React, { useRef } from "react";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { AppointmentForm } from "@/app/(app)/calendar/form";
import {
  SelectedAppointment,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  AppointmentFormData,
  AppointmentFormRef,
} from "@/types/agenda";


interface CreateUpdateModalProps {
  open: boolean;
  appointment: SelectedAppointment;
  onClose: () => void;
  onCreate: (appointment: CreateAppointmentDTO) => Promise<void>;
  onUpdate: (appointment: UpdateAppointmentDTO) => Promise<void>;
}

export function CreateUpdateModal({
  open,
  appointment,
  onClose,
  onCreate,
  onUpdate,
}: CreateUpdateModalProps) {

  const formRef = useRef<AppointmentFormRef>(null);

  if (appointment.mode !== "create" && appointment.mode !== "update") {
    return null;
  }

  const isEdit = appointment.mode === "update";
  const defaultValues = appointment.draft;

  const handleSubmit = async (data: AppointmentFormData) => {
    if (isEdit) {
      await onUpdate({
        ...appointment.draft,
        ...data,
      });
    } else {
      await onCreate({
        name: data.name,
        date: data.date,
        time: data.time,
        notes: data.notes,
      });
    }

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <h2>{isEdit ? "Editar Agendamento" : "Adicionar Agendamento"}</h2>
      </Modal.Header>

      <Modal.Body>
        <AppointmentForm
          ref={formRef}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        />
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-around mt-3">
          <Button
            type="button"
            label="Salvar"
            variant="primary"
            size="lg"
            onClick={() => formRef.current?.submit()}
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