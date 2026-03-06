"use client"

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "../MonthClosing.module.css";
import { MessageCard } from "@/components/message/message";
import { Button } from "@/components/button/button";
import { SummaryRow } from "@/app/(app)/monthclosing/tab2/summary";
import { useMonthClosingFlow } from "@/app/(app)/monthclosing/provider";
import { useMonthClosing } from "@/hooks/useMonthClosing";
import { MonthClosing } from "@/types/monthClosing";

type ValuesForm = {
  bankValue: number;
  cashValue: number;
  cardValue: number;
  cardValueNext: number;
};

const INITIAL_FORM: ValuesForm = {
  bankValue: 0,
  cashValue: 0,
  cardValue: 0,
  cardValueNext: 0,
};

export default function TabTwo() {
  const [form, setForm] = useState<ValuesForm>(INITIAL_FORM);

  const router = useRouter();
  const { create, update } = useMonthClosing();
  const { 
    selectedMonthClosing,
    setSelectedMonthClosing, 
    closingRevenue
  } = useMonthClosingFlow();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const saveMonthClosing = async () => {
    if (!selectedMonthClosing) return;

    const payload: MonthClosing = {
      ...selectedMonthClosing,
      bank_value: form.bankValue,
      cash_value: form.cashValue,
      card_value: form.cardValue,
      card_value_next_month: form.cardValueNext,
    };

    const response =
      selectedMonthClosing.id === 0
        ? await create(payload)
        : await update(payload);

    if (response) setSelectedMonthClosing(response);
  };

  const totalMonthlyRevenue = useMemo(() => {
    if (!closingRevenue || closingRevenue.length === 0) return 0;

    return closingRevenue.reduce(
      (acc, item) => acc + item.net_value,
      0
    );
  }, [closingRevenue]);

  const sumValues = useMemo(() => {
    return (
      form.bankValue +
      form.cashValue +
      form.cardValue -
      form.cardValueNext
    );
  }, [form]);

  const diffValues = useMemo(() => {
    return sumValues - totalMonthlyRevenue;
  }, [sumValues, totalMonthlyRevenue]);

  useEffect(() => {
    if (!selectedMonthClosing || selectedMonthClosing.id === 0) return;

    setForm({
      bankValue: selectedMonthClosing.bank_value,
      cashValue: selectedMonthClosing.cash_value,
      cardValue: selectedMonthClosing.card_value,
      cardValueNext: selectedMonthClosing.card_value_next_month,
    });
  }, [selectedMonthClosing]);

  if (!selectedMonthClosing) {
    return (
      <MessageCard 
        title="Nenhum relatório de fechamento de caixa foi selecionado."
        subtitle="Volte para a aba Relatórios para selecionar."
        variant="error"
      />
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex flex-col md:flex-row justify-center gap-3">
        <div className={`${styles.income} w-full md:w-1/2`}>
          {[
            { id: "bankValue", label: "Banco do Brasil" },
            { id: "cashValue", label: "Dinheiro" },
            { id: "cardValue", label: "Cartão" },
            { id: "cardValueNext", label: "Cartão mês seguinte" },
          ].map(({ id, label }) => (
            <div key={id} className="flex form-item mb-3">
              <label htmlFor={id} className={styles.label}>
                {label}:
              </label>
              <input
                id={id}
                name={id}
                type="number"
                className={styles.inputWide}
                value={form[id as keyof ValuesForm]}
                onChange={handleInputChange}
                min="0.001"
                step="0.001"
                required
              />
            </div>
          ))}

          <div className="flex justify-end mt-3">
            <Button
              label="Salvar"
              variant="primary"
              size="lg"
              onClick={saveMonthClosing}
            />
          </div>
        </div>

        <div className={`${styles.summary} flex flex-col justify-between gap-4 w-full md:w-1/2`}>
          <div className="flex flex-col gap-4">
            <SummaryRow
              label="Soma das entradas"
              value={sumValues}
            />
            <SummaryRow
              label="Receita Líquida"
              value={totalMonthlyRevenue}
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <p>
              A soma das entradas deve ser igual à receita líquida.
            </p>

            <SummaryRow
              label="Diferença"
              value={diffValues}
              variant={
                diffValues > 0
                  ? "positive"
                  : diffValues < 0
                  ? "negative"
                  : "positive"
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-3">
        <Button
          label="Avançar"
          size="lg"
          onClick={() => router.push("/monthclosing/summary")} />
      </div>
    </div>
  );
};