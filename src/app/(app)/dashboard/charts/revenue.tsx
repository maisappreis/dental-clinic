"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Revenue } from "@/types/revenue";
import { Expense } from "@/types/expense";
import { MonthNames } from "@/types/chart";
import { monthNames } from "@/constants/date";
import { groupValuesByMonth } from "@/utils/charts";
import { revenueExpensesLineChartOptions } from "@/constants/charts";
import "@/utils/chart";


export function RevenueExpensesChart({
  revenue,
  expenses,
}: {
  revenue: Revenue[];
  expenses: Expense[];
}) {
  const chartData = useMemo(() => {
    if (!revenue.length && !expenses.length) {
      return { labels: [], datasets: [] };
    }

    const revenueByMonth = groupValuesByMonth(revenue);
    const expensesByMonth = groupValuesByMonth(expenses);

    const today = new Date();
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}`;
    }).reverse();

    const labels = last12Months.map(key => {
      const [year, month] = key.split("-");
      return `${monthNames[month as keyof MonthNames]} ${year}`;
    });

    return {
      labels,
      datasets: [
        {
          label: "Receitas",
          data: last12Months.map(key => revenueByMonth[key] || 0),
          borderColor: "rgba(19, 163, 0, 0.8)",
          backgroundColor: "rgba(19, 163, 0, 0.3)",
        },
        {
          label: "Despesas",
          data: last12Months.map(key => expensesByMonth[key] || 0),
          borderColor: "rgba(255, 0, 0, 0.8)",
          backgroundColor: "rgba(255, 0, 0, 0.3)",
        },
      ],
    };
  }, [revenue, expenses]);

  if (!chartData.labels.length) {
    return <span>Sem dados para exibir</span>;
  }

  return (
    <Line
      data={chartData}
      options={revenueExpensesLineChartOptions}
    />
  );
};