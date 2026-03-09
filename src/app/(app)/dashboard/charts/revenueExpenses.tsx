"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Revenue } from "@/types/revenue";
import { Expense } from "@/types/expense";
import { MonthNames } from "@/types/chart";
import { monthNames } from "@/constants/date";
import { groupValuesByMonth } from "@/utils/charts";
import { revenueExpensesLineChartOptions } from "@/constants/charts";
import styles from "../Charts.module.css";
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

    const style = getComputedStyle(document.documentElement);
    const revenueColor = style.getPropertyValue("--success-color");
    const expenseColor = style.getPropertyValue("--error-color");

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
          borderColor: revenueColor,
          backgroundColor: revenueColor
        },
        {
          label: "Despesas",
          data: last12Months.map(key => expensesByMonth[key] || 0),
          borderColor: expenseColor,
          backgroundColor: expenseColor
        },
      ],
    };
  }, [revenue, expenses]);

  if (!chartData.labels.length) {
    return (
      <div className={styles.noData}>
        <span>Sem dados para exibir</span>
      </div>
    );
  }

  return (
    <Line
      data={chartData}
      options={revenueExpensesLineChartOptions}
    />
  );
};