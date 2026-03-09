"use client";

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
        <p className="text-base">
          Tem certeza que deseja excluir o valor de
          <strong> {formatValueToBRL(revenue.value)} </strong> do(a) paciente
          <strong> {revenue.name}</strong>?
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