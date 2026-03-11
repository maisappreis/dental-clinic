"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "@/types/chart";
import { proceduresLineChartOptions } from "@/constants/charts";
import styles from "../Charts.module.css";
import "@/utils/chart";


export function NumberOfProceduresChart({data}: {data: Chart}) {
  const chartData = useMemo(() => {
    if (!data.labels.length) {
      return { labels: [], datasets: [] };
    }

    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue("--primary-color");

    return {
      labels: data.labels,
      datasets: [
        {
          label: "Número de procedimentos realizados",
          data: data.data,
          backgroundColor: color,
          borderColor: color,
          tension: 0.3,
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

  return <Line data={chartData} options={proceduresLineChartOptions} />;
};