import { MonthClosing } from "@/types/monthClosing";

export interface SummaryItem {
  label: string;
  value: number;
};

export interface MonthClosingSummary {
  summary: SummaryItem[];
  inputs: SummaryItem[];
  outputs: SummaryItem[];
  totalInputs: number;
  totalOutputs: number;
  balance: number;
};

export function buildMonthClosingSummary(
  closing: MonthClosing
): MonthClosingSummary {
  const summary = [
    { label: "Receita Bruta:", value: closing.gross_revenue },
    { label: "Receita Líquida:", value: closing.net_revenue },
    { label: "Despesas:", value: closing.expenses },
    { label: "Lucro Líq. Mirian:", value: closing.net_profit },
  ];

  const inputs = [
    { label: "Banco do Brasil:", value: closing.bank_value },
    { label: "Dinheiro:", value: closing.cash_value },
    { label: "Cartão:", value: closing.card_value - closing.card_value_next_month },
    { label: "Dra. Alana:", value: closing.other_revenue },
  ];

  const outputs = [
    { label: "Despesas:", value: closing.expenses },
    { label: "Dra. Mirian:", value: closing.net_profit },
  ];

  const totalInputs = inputs.reduce((t, i) => t + i.value, 0);
  const totalOutputs = outputs.reduce((t, i) => t + i.value, 0);

  return {
    summary,
    inputs,
    outputs,
    totalInputs,
    totalOutputs,
    balance: totalInputs - totalOutputs,
  };
};