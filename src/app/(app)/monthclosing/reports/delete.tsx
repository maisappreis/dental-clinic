"use client";

import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { MonthClosing } from "@/types/monthClosing";

interface DeleteModalProps {
  open: boolean;
  monthClosing?: MonthClosing;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export function DeleteModal({
  open,
  monthClosing,
  onClose,
  onDelete,
}: DeleteModalProps) {

  if (!monthClosing) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        Excluir Fechamento de Caixa
      </Modal.Header>

      <Modal.Body>
        <p className="text-base">
          Tem certeza que deseja excluir o relatório de fechamento de caixa do mês
          <strong> {monthClosing.reference}</strong>?
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