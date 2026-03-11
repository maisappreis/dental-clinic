"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "@/types/chart";
import styles from "../Charts.module.css";
import { proceduresBarChartOptions } from "@/constants/charts";
import "@/utils/chart";


export function MostPerformedProceduresChart({data}: {data: Chart}) {
  const style = getComputedStyle(document.documentElement);
  const color = style.getPropertyValue("--primary-color");

  const chartData = useMemo(() => {
    if (!data.labels.length) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: data.labels,
      datasets: [
        {
          label: "Procedimentos mais realizados",
          data: data.data,
          backgroundColor: color
        },
      ],
    };
  }, [data, color]);

  if (!chartData.labels.length) {
    return (
      <div className={styles.noData}>
        <span>Sem dados para exibir</span>
      </div>
    );
  }

  return <Bar data={chartData} options={proceduresBarChartOptions} />;
};