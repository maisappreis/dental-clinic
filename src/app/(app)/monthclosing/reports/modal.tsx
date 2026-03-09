"use client"

import { useEffect, useState } from "react";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { Select } from "@/components/form/select";
import { Checkbox } from "@/components/form/checkbox";

import { months, years } from "@/constants/date";
import { getNextMonthName } from "@/utils/date";
import { getDefaultCashClosingForm } from "@/app/(app)/monthclosing/domain/reportsUtils";
import { CashClosingConfirmation, CashClosingFormState } from "@/types/monthClosing";


interface CashClosingModalProps {
  open: boolean;
  onConfirmation: (data: CashClosingConfirmation) => void;
  onClose: () => void;
};

export function CashClosingModal({
  open,
  onConfirmation,
  onClose,
}: CashClosingModalProps) {

  const [form, setForm] = useState<CashClosingFormState>({
    month: "",
    monthNumber: 0,
    year: "",
    revenueCheck: false,
    expensesCheck: false,
  });

  const confirmationsChecked = form.revenueCheck && form.expensesCheck;

  const closeModal = () => {
    setForm(getDefaultCashClosingForm());
    onClose();
  };

  const nextMonthName = form.month
  ? getNextMonthName(form.month)
  : "-";

  useEffect(() => {
    if (!open) return;
    setForm(getDefaultCashClosingForm());
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        Fechamento de caixa referente ao mês:
      </Modal.Header>

      <Modal.Body>
        <div className="flex gap-3">
          <Select
            value={form.month}
            options={months.map((item) => ({
              label: item,
              value: item,
            }))}
            onChange={(month) => {
              const monthIndex = months.indexOf(month) + 1;

              setForm((prev) => ({
                ...prev,
                month,
                monthNumber: monthIndex,
              }));
            }}
          />

          <Select
            value={form.year}
            options={years.map((item) => ({
              label: item,
              value: item,
            }))}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                year: value,
              }))
            }
          />
        </div>

        <Checkbox
          label={<>
            Confirmo que todas as <strong>receitas de {form.month}</strong> foram cadastradas.
          </>}
          checked={form.revenueCheck}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              revenueCheck: value,
            }))
          }
        />

        <Checkbox
          label={<>
            Confirmo que todas as <strong>despesas de {nextMonthName}</strong> foram cadastras.
          </>}
          checked={form.expensesCheck}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              expensesCheck: value,
            }))
          }
        />
      </Modal.Body>

      <Modal.Footer>
        <div className="button-area">
          <Button
            label="Confirmar"
            variant="primary"
            size="lg"
            disabled={!confirmationsChecked}
            onClick={() => onConfirmation({
              month: form.month,
              year: form.year,
              monthNumber: form.monthNumber,
            })}
          />
          <Button
            label="Cancelar"
            variant="secondary"
            size="md"
            onClick={closeModal}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};