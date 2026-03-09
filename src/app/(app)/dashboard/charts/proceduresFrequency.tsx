"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Revenue } from "@/types/revenue";
import { ChartData } from "@/types/chart";
import styles from "../Charts.module.css";
import "@/utils/chart";

import { getMostPerformedProcedures } from "@/utils/charts";
import { proceduresBarChartOptions } from "@/constants/charts";

type Props = {
  revenue: Revenue[];
};

export function MostPerformedProceduresChart({ revenue }: Props) {
  const style = getComputedStyle(document.documentElement);
  const color = style.getPropertyValue("--primary-color");

  const chartData = useMemo<ChartData>(() => {
    if (!revenue.length) {
      return { labels: [], datasets: [] };
    }

    const procedures = getMostPerformedProcedures(revenue);

    return {
      labels: procedures.map(([procedure]) => procedure),
      datasets: [
        {
          label: "Procedimentos mais realizados",
          data: procedures.map(([, count]) => count),
          backgroundColor: color
        },
      ],
    };
  }, [revenue, color]);

  if (!chartData.labels.length) {
    return (
      <div className={styles.noData}>
        <span>Sem dados para exibir</span>
      </div>
    );
  }

  return <Bar data={chartData} options={proceduresBarChartOptions} />;
};