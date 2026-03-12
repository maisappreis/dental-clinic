import { buildMonthClosingSummary } from "./summaryUtils";
import { MonthClosing } from "@/types/monthClosing";

describe("buildMonthClosingSummary", () => {
  const mockClosing: MonthClosing = {
    gross_revenue: 10000,
    net_revenue: 8000,
    expenses: 3000,
    net_profit: 5000,
    bank_value: 4000,
    cash_value: 2000,
    card_value: 3000,
    card_value_next_month: 1000,
    other_revenue: 500,
  } as MonthClosing;

  it("builds summary correctly", () => {
    const result = buildMonthClosingSummary(mockClosing);

    expect(result.summary).toEqual([
      { label: "Receita Bruta:", value: 10000 },
      { label: "Receita Líquida:", value: 8000 },
      { label: "Despesas:", value: 3000 },
      { label: "Lucro Líq. Mirian:", value: 5000 },
    ]);
  });

  it("calculates inputs correctly", () => {
    const result = buildMonthClosingSummary(mockClosing);

    expect(result.inputs).toEqual([
      { label: "Banco do Brasil:", value: 4000 },
      { label: "Dinheiro:", value: 2000 },
      { label: "Cartão:", value: 2000 }, // 3000 - 1000
      { label: "Dra. Alana:", value: 500 },
    ]);
  });

  it("calculates totals and balance", () => {
    const result = buildMonthClosingSummary(mockClosing);

    expect(result.totalInputs).toBe(8500); // 4000 + 2000 + 2000 + 500
    expect(result.totalOutputs).toBe(8000); // 3000 + 5000
    expect(result.balance).toBe(500); // 8500 - 8000
  });
});