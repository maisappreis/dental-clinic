"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { ChartRevenueExpense } from "@/types/chart";
import { revenueExpensesLineChartOptions } from "@/constants/charts";
import styles from "../Charts.module.css";
import "@/utils/chart";


export function RevenueExpensesChart({ data }: { data: ChartRevenueExpense }) {
  const chartData = useMemo(() => {
    if (!data.labels.length) {
      return { labels: [], datasets: [] };
    }

    const style = getComputedStyle(document.documentElement);
    const revenueColor = style.getPropertyValue("--success-color");
    const expenseColor = style.getPropertyValue("--error-color");

    return {
      labels: data.labels,
      datasets: [
        {
          label: "Receitas",
          data: data.data.revenue,
          borderColor: revenueColor,
          backgroundColor: revenueColor
        },
        {
          label: "Despesas",
          data: data.data.expense,
          borderColor: expenseColor,
          backgroundColor: expenseColor
        },
      ],
    };
  }, [data]);

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