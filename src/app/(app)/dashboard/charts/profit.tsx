"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ProfitData } from "@/types/chart";
import { profitBarChartOptions } from "@/constants/charts";
import styles from "../Charts.module.css";
import "@/utils/chart";


export function ProfitChart({ profit }: { profit: ProfitData }) {
  const chartData = useMemo(() => {
    if (!profit || !profit.labels.length || !profit.profit.length) {
      return { labels: [], datasets: [] };
    }

    const style = getComputedStyle(document.documentElement);
    const barColor = style.getPropertyValue("--tertiary-color");

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
    return (
      <div className={styles.noData}>
        <span>Sem dados para exibir</span>
      </div>
    );
  }

  return <Bar data={chartData} options={profitBarChartOptions} />;
};