"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Revenue } from "@/types/revenue";
import { ChartData } from "@/types/chart";
import "@/utils/chart";

import { getMostPerformedProcedures } from "@/utils/charts";
import { barChartOptions } from "@/constants/charts";

type Props = {
  revenue: Revenue[];
};

export function MostPerformedProceduresChart({ revenue }: Props) {
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
          backgroundColor: "rgba(1, 32, 144, 0.7)",
          borderColor: "rgba(75,192,192,1)",
        },
      ],
    };
  }, [revenue]);

  if (!chartData.labels.length) {
    return <span>Sem dados para exibir</span>;
  }

  return <Bar data={chartData} options={barChartOptions} />;
};