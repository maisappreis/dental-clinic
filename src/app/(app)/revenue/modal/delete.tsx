"use client";

import React from "react";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { formatValueToBRL } from "@/utils/utils";
import { Revenue } from "@/types/revenue";

interface DeleteModalProps {
  open: boolean;
  revenue?: Revenue;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export function DeleteModal({
  open,
  revenue,
  onClose,
  onDelete,
}: DeleteModalProps) {

  if (!revenue) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        Excluir Receita
      </Modal.Header>

      <Modal.Body>
        Tem certeza que deseja excluir o valor de
        <strong> {formatValueToBRL(revenue.value)} </strong> do paciente
        <strong> {revenue.name}</strong>?
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