"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Revenue } from "@/types/revenue";
import { monthNames } from "@/constants/date";
import { proceduresLineChartOptions } from "@/constants/charts";
import { groupRevenueByMonth } from "@/utils/charts";
import "@/utils/chart";


export function NumberOfProceduresChart({
  revenue,
}: {
  revenue: Revenue[];
}) {
  const chartData = useMemo(() => {
    if (!revenue.length) {
      return { labels: [], datasets: [] };
    }

    const styles = getComputedStyle(document.documentElement);
    const color = styles.getPropertyValue("--primary-color");

    const groupedByMonth = groupRevenueByMonth(revenue);

    const sortedKeys = Object.keys(groupedByMonth)
      .sort()
      .slice(-12);

    const labels = sortedKeys.map((key) => {
      const [year, month] = key.split("-");
      return `${monthNames[month as keyof typeof monthNames]} ${year}`;
    });

    const values = sortedKeys.map((key) => groupedByMonth[key]);

    return {
      labels,
      datasets: [
        {
          label: "Número de procedimentos realizados",
          data: values,
          backgroundColor: color,
          borderColor: color,
          tension: 0.3,
        },
      ],
    };
  }, [revenue]);

  if (!chartData.labels.length) {
    return <span>Sem dados para exibir</span>;
  }

  return <Line data={chartData} options={proceduresLineChartOptions} />;
};