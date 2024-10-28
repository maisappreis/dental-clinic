
'use client'
import { useState, useEffect, useMemo } from 'react';
import { Bar } from "react-chartjs-2";
import { RevenueProps } from '@/types/revenue';
import { ChartData, TooltipItem } from '@/types/chart';
import "@/utils/chart"

export default function MostPerformedProceduresChart({ revenue }: { revenue: RevenueProps[] }) {
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
      const procedureCount = revenue.reduce((acc: Record<string, number>, curr: RevenueProps) => {
        if (!acc[curr.procedure]) {
          acc[curr.procedure] = 0;
        }
        acc[curr.procedure]++;
        return acc;
      }, {});

      const sortedProcedures = Object.entries(procedureCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 7);

      const labels = sortedProcedures.map(([procedure]) => procedure);
      const values = sortedProcedures.map(([, count]) => count);

      const options = setLayout();
      setOptions(options);

      return {
        labels: labels,
        datasets: [
          {
            label: 'Procedimentos mais realizados',
            backgroundColor: 'rgba(1, 32, 144, 0.7)',
            borderColor: 'rgba(75,192,192,1)',
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
      <Bar data={data} options={options} />
    ) : (
      <span>Sem dados para exibir</span>
    )
  );
}