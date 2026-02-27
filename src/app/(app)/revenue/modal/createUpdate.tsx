"use client";

import React, { useRef } from "react";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { RevenueForm } from "@/app/(app)/revenue/form";
import {
  Revenue,
  CreateRevenueDTO,
  UpdateRevenueDTO,
  RevenueFormData,
  RevenueFormRef
} from "@/types/revenue";

interface CreateUpdateModalProps {
  open: boolean;
  revenue?: Revenue;
  onClose: () => void;
  onCreate: (data: CreateRevenueDTO) => Promise<void>;
  onUpdate: (data: UpdateRevenueDTO) => Promise<void>;
}

export function CreateUpdateModal({
  open,
  revenue,
  onClose,
  onCreate,
  onUpdate
}: CreateUpdateModalProps) {

  const formRef = useRef<RevenueFormRef>(null);

  const handleSubmit = async (data: RevenueFormData) => {
    if (revenue) {
      const updatePayload: UpdateRevenueDTO = {
        ...data,
        id: revenue.id!,
        release_date: revenue.release_date,
        net_value: revenue.net_value
      };

      await onUpdate(updatePayload);
    } else {
      const createPayload: CreateRevenueDTO = {
        name: data.name,
        date: data.date,
        value: data.value,
        installments: data.installments,
        notes: data.notes,
        cpf: data.cpf,
        nf: data.nf,
        procedure: data.procedure,
        payment: data.payment
      };

      await onCreate(createPayload);
    }

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <h2>{revenue ? "Editar Receita" : "Adicionar Receita"}</h2>
      </Modal.Header>

      <Modal.Body>
        <RevenueForm
          ref={formRef}
          defaultValues={
            revenue ? revenue : undefined
          }
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