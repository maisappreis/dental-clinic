"use client";

import React from "react";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { Expense } from "@/types/expense";

interface PaymentStatusModalProps {
  open: boolean;
  expense?: Expense;
  onClose: () => void;
  onChange: () => Promise<void>;
}

export function PaymentStatusModal({
  open,
  expense,
  onClose,
  onChange,
}: PaymentStatusModalProps) {

  if (!expense) return null;

  const status = expense.is_paid ? "à pagar" : "pago";

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        Marcar como { status }
      </Modal.Header>

      <Modal.Body>
        Gostaria de marcar essa despesa como <strong>{status}</strong>?
      </Modal.Body>

      <Modal.Footer>
        <div className="button-area">
          <Button
            label="Confirmar"
            variant="primary"
            size="lg"
            onClick={onChange}
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