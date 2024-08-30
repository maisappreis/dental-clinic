'use client'
import { useState, useEffect, useMemo } from 'react';
import { Line } from "react-chartjs-2";
import "@/utils/chart"
import { RevenueProps, RevenueList } from '@/types/revenue';
import { ChartData, MonthNames } from '@/types/chart';
import { monthNames } from "@/assets/data";

export default function NumberOfProceduresChart({ revenue }: { revenue: RevenueList }) {
  const [data, setData] = useState<ChartData>({
    labels: [],
    datasets: []
  })

  // const groupByMonth = useMemo(() => {
  //   return revenue.reduce((acc: Record<string, number>, curr: RevenueProps) => {
  //     const month: string = curr.date.slice(5, 7);
  //     const year: string = curr.date.slice(0, 4);
  //     const key = `${year}-${month}`;

  //     if (!acc[key]) {
  //       acc[key] = 0;
  //     }
  //     acc[key]++;
  //     return acc;
  //   }, {});
  // }, [revenue]);

  const drawChart = useMemo(() => {
    if (revenue && revenue.length > 0) {
      // const groupedByMonth = groupByMonth;
      const groupedByMonth = revenue.reduce((acc: Record<string, number>, curr: RevenueProps) => {
        const month: string = curr.date.slice(5, 7);
        const year: string = curr.date.slice(0, 4);
        const key = `${year}-${month}`;
  
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key]++;
        return acc;
      }, {});

      const sortedKeys = Object.keys(groupedByMonth).sort().slice(-12);

      const labels = sortedKeys.map((key: string) => {
        const [year, month] = key.split("-");
        return `${monthNames[month as keyof MonthNames]} ${year}`;
      });

      const values = sortedKeys.map(key => groupedByMonth[key]);

      return {
        labels: labels,
        datasets: [
          {
            label: 'Número de procedimentos realizados',
            backgroundColor: 'rgba(1, 32, 144)',
            borderColor: 'rgba(1, 32, 144)',
            data: values,
          },
        ],
      };
    }
    return {
      labels: [],
      datasets: []
    };
  }, [revenue]);

  useEffect(() => {
    setData(drawChart);
  }, [drawChart]);

  return (
    data.labels.length > 0 ? (
      <Line data={data} />
    ) : (
      <span>Sem dados para exibir</span>
    )
  );
}