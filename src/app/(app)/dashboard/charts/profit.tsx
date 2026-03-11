"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "@/types/chart";
import { profitBarChartOptions } from "@/constants/charts";
import styles from "../Charts.module.css";
import "@/utils/chart";


export function ProfitChart({ data }: { data: Chart }) {
  const chartData = useMemo(() => {
    if (!data.labels.length) {
      return { labels: [], datasets: [] };
    }

    const style = getComputedStyle(document.documentElement);
    const barColor = style.getPropertyValue("--tertiary-color");

    return {
      labels: data.labels,
      datasets: [
        {
          label: "Lucro bruto mensal",
          data: data.data,
          backgroundColor: barColor
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

  return <Bar data={chartData} options={profitBarChartOptions} />;
};