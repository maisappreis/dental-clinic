"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ProfitData } from "@/types/chart";
import { profitBarChartOptions } from "@/constants/charts";
import "@/utils/chart";


export function ProfitChart({ profit }: { profit: ProfitData }) {
  const chartData = useMemo(() => {
    if (!profit || !profit.labels.length || !profit.profit.length) {
      return { labels: [], datasets: [] };
    }

    const styles = getComputedStyle(document.documentElement);
    const barColor = styles.getPropertyValue("--tertiary-color");

    return {
      labels: profit.labels,
      datasets: [
        {
          label: "Lucro bruto mensal",
          data: profit.profit,
          backgroundColor: barColor
        },
      ],
    };
  }, [profit]);

  if (!chartData.labels.length) {
    return <span>Sem dados para exibir</span>;
  }

  return <Bar data={chartData} options={profitBarChartOptions} />;
};