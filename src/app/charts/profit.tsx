'use client'
import { useState, useEffect, useMemo } from 'react';
import { Bar } from "react-chartjs-2";
import { ChartData, TooltipItem, ProfitData } from '@/types/chart';
import { formatValueToBRL } from "@/utils/utils";
import "@/utils/chart";

export default function ProfitChart(
  { profit }: { profit: ProfitData }
) {
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
              if (context.parsed.y !== null && context.raw) {
                label += `${formatValueToBRL(context.raw)}`;
              }
              return label;
            }
          }
        }
      }
    };
  };

  const drawChart = useMemo(() => {
    if (profit && profit.profit.length > 0 && profit.labels.length > 0) {
      const options = setLayout();
      setOptions(options);

      return {
        labels: profit.labels,
        datasets: [
          {
            label: 'Lucro bruto mensal',
            backgroundColor: 'rgba(19, 163, 0, 0.7)',
            borderColor: 'rgba(75,192,192,1)',
            data: profit.profit,
          }
        ]
      };
    }
    return {
      labels: [],
      datasets: []
    };
  }, [profit]);

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