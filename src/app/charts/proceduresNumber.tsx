'use client'
import { useState, useEffect, useMemo } from 'react';
import { Line } from "react-chartjs-2";
import "@/utils/chart"
import { RevenueProps, RevenueList } from '@/types/revenue';
import { ChartData, MonthNames, TooltipItem } from '@/types/chart';
import { monthNames } from "@/assets/data";

export default function NumberOfProceduresChart({ revenue }: { revenue: RevenueList }) {
  const [options, setOptions] = useState({});
  const [data, setData] = useState<ChartData>({
    labels: [],
    datasets: []
  });

  const setLayout = () => {
    return {
      plugins: {
        legend: {
          labels: {
            font: {
              size: 20
            },
            color: 'rgba(0, 0, 0, 0.8)',
          }
        },
        tooltip: {
          titleFont: {
            size: 18,
          },
          bodyFont: {
            size: 16,
          },
          padding: 10,
          boxPadding: 8,
          callbacks: {
            label: function (context: TooltipItem) {
              let label = ""
              if (context.parsed.y !== null) {
                label += `${context.raw} realizados`;
              }
              return label;
            }
          }
        }
      }
    };
  };

  const drawChart = useMemo(() => {
    if (revenue && revenue.length > 0) {
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

      const options = setLayout();
      setOptions(options);

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
      <Line data={data} options={options} />
    ) : (
      <span>Sem dados para exibir</span>
    )
  );
}