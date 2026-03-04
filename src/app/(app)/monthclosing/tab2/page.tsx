'use client'
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from "next/navigation";
import styles from "./Tab2.module.css";
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
    <div>
      <div className="flex justify-center">
        <div className={`${styles.box} w-1/2`}>
          {[
            { id: "bankValue", label: "Banco do Brasil" },
            { id: "cashValue", label: "Dinheiro" },
            { id: "cardValue", label: "Cartão" },
            { id: "cardValueNext", label: "Cartão mês seguinte" },
          ].map(({ id, label }) => (
            <div key={id} className="flex form-item">
              <label htmlFor={id} className="form-label">
                {label}:
              </label>
              <input
                id={id}
                name={id}
                type="number"
                className="form-input"
                value={form[id as keyof ValuesForm]}
                onChange={handleInputChange}
                min="0.001"
                step="0.001"
                required
              />
            </div>
          ))}

          <div className={styles.speechbubble}>
            <strong>Cartão do mês seguinte: </strong>
            podem haver valores que são referentes a receita do
            mês que vem, mas que já estão liberados.
            Esses valores devem ser subtraídos, pois entrarão
            apenas no mês seguinte.
          </div>

          <div className="flex justify-end mt-3">
            <Button
              label="Salvar"
              variant="primary"
              size="lg"
              onClick={saveMonthClosing}
            />
          </div>
        </div>

        <div className={`${styles.summary} w-1/2`}>
          <SummaryRow
            label="Soma das entradas"
            value={sumValues}
          />
          <SummaryRow
            label="Receita Líquida"
            value={totalMonthlyRevenue}
          />

          <p className="my-4">
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

      <div className="flex justify-end mt-3">
        <Button
          label="Avançar"
          variant="primary"
          size="lg"
          onClick={() => router.push("/monthclosing/summary")} />
      </div>
    </div>
  );
};