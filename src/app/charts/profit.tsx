'use client'
import { useState, useEffect, useMemo } from 'react';
import { Bar } from "react-chartjs-2";
import "@/utils/chart"
import { RevenueList } from '@/types/revenue';
import { ExpenseList } from '@/types/expense';
import { ChartData, TooltipItem } from '@/types/chart';
import { calculateMonthlyProfit } from '@/utils/utils';
import { formatValueToBRL } from "@/utils/utils";

export default function ProfitChart(
  { revenue, expenses }: { revenue: RevenueList, expenses: ExpenseList }
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
    if (revenue && expenses && revenue.length > 0 && expenses.length > 0) {
      const { monthsLabels, monthlyProfit } = calculateMonthlyProfit(revenue, expenses);

      const options = setLayout();
      setOptions(options);

      return {
        labels: monthsLabels,
        datasets: [
          {
            label: 'Lucro mensal',
            backgroundColor: 'rgba(19, 163, 0, 0.7)',
            borderColor: 'rgba(75,192,192,1)',
            data: monthlyProfit,
          }
        ]
      };
    }
    return {
      labels: [],
      datasets: []
    };
  }, [revenue, expenses]);

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