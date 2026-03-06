"use client";

import { useRef } from "react";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { ExpenseForm } from "@/app/(app)/expense/form";
import {
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO,
  ExpenseFormData,
  ExpenseFormRef
} from "@/types/expense";

interface CreateUpdateModalProps {
  open: boolean;
  expense?: Expense;
  onClose: () => void;
  onCreate: (data: CreateExpenseDTO) => Promise<void>;
  onUpdate: (data: UpdateExpenseDTO) => Promise<void>;
}

export function CreateUpdateModal({
  open,
  expense,
  onClose,
  onCreate,
  onUpdate
}: CreateUpdateModalProps) {

  const formRef = useRef<ExpenseFormRef>(null);

  const handleSubmit = async (data: ExpenseFormData) => {
    if (expense) {
      const updatePayload: UpdateExpenseDTO = {
        ...data,
        id: expense.id!,
        year: expense.year!,
        month: expense.month!,
        is_paid: expense.is_paid!,
        hasInstallments: data.hasInstallments
      };

      await onUpdate(updatePayload);
    } else {
      const createPayload: CreateExpenseDTO = {
        name: data.name,
        date: data.date,
        value: data.value,
        installments: data.installments,
        hasInstallments: data.hasInstallments,
        notes: data.notes,
      };

      await onCreate(createPayload);
    }

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <h2>{expense ? "Editar Despesa" : "Adicionar Despesa"}</h2>
      </Modal.Header>

      <Modal.Body>
        <ExpenseForm
          ref={formRef}
          defaultValues={
            expense ? expense : undefined
          }
          onSubmit={handleSubmit}
        />
      </Modal.Body>

      <Modal.Footer>
        <div className="button-area">
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