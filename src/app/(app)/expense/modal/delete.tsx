"use client";

import React from "react";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { formatValueToBRL } from "@/utils/utils";
import { Expense } from "@/types/expense";

interface DeleteModalProps {
  open: boolean;
  expense?: Expense;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export function DeleteModal({
  open,
  expense,
  onClose,
  onDelete,
}: DeleteModalProps) {

  if (!expense) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        Excluir Despesa
      </Modal.Header>

      <Modal.Body>
        Tem certeza que deseja excluir o valor de
        <strong>{formatValueToBRL(expense.value)}
        </strong> referente a despesa de <strong>{expense.name}</strong>?
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