'use client'
import { useState, useEffect, useMemo } from 'react';
import { Bar } from "react-chartjs-2";
import "@/utils/chart"
import { RevenueList } from '@/types/revenue';
import { ExpenseList } from '@/types/expense';
import { ChartData, TooltipItem } from '@/types/chart';
import { calculateMonthlyProfit } from '@/utils/utils';

export default function ProfitChart(
  { revenue, expenses }: { revenue: RevenueList, expenses: ExpenseList }
) {
  const [data, setData] = useState<ChartData>({
    labels: [],
    datasets: []
  });

  const drawChart = useMemo(() => {
    if (revenue && expenses && revenue.length > 0 && expenses.length > 0) {
      const { months, monthlyProfit } = calculateMonthlyProfit(revenue, expenses);

      return {
        labels: months,
        datasets: [
          {
            label: 'Lucro Mensal',
            backgroundColor: 'rgba(19, 163, 0, 0.7)',
            borderColor: 'rgba(75,192,192,1)',
            data: monthlyProfit,
          }
        ],
        plugins: {
          legend: {
            labels: {
              font: {
                size: 16 // Aumenta o tamanho da legenda
              },
              color: 'rgba(0, 0, 0, 0.8)', // Cor das legendas
            }
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // Cor do fundo da tooltip
          titleFont: {
            size: 14, // Tamanho da fonte do título
          },
          bodyFont: {
            size: 12, // Tamanho da fonte do corpo
          },
          callbacks: {
            label: function(context: TooltipItem) {
              return `Lucro: R$ ${context.raw?.toFixed(2).replace('.', ',')}`;
            }
          }
        }
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
      <Bar data={data} />
    ) : (
      <span>Sem dados para exibir</span>
    )
  );
}