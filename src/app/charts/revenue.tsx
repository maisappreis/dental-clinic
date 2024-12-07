'use client'
import { useState, useEffect, useMemo } from 'react';
import { Line } from "react-chartjs-2";
import { RevenueProps } from '@/types/revenue';
import { ExpenseProps } from '@/types/expense';
import { ChartData, MonthNames, TooltipItem } from '@/types/chart';
import { monthNames } from "@/assets/data";
import { formatValueToBRL } from "@/utils/utils";
import "@/utils/chart";

export default function RevenueExpensesChart(
  { revenue, expenses }: { revenue: RevenueProps[], expenses: ExpenseProps[] }
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
      const groupByMonth = (items: (RevenueProps | ExpenseProps)[]) => {
        return items.reduce((acc: Record<string, number>, curr: RevenueProps | ExpenseProps) => {
          const month = curr.date.slice(5, 7);
          const year = curr.date.slice(0, 4);
          const key = `${year}-${month}`;
          
          if (!acc[key]) {
            acc[key] = 0;
          }
          acc[key] += curr.value;
          return acc;
        }, {});
      };

      const revenueByMonth = groupByMonth(revenue);
      const expensesByMonth = groupByMonth(expenses);

      const today = new Date();
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const year = date.getFullYear().toString();
        return `${year}-${month}`;
      }).reverse();

      const labels = last12Months.map(date => {
        const [year, month] = date.split("-");
        return `${monthNames[month as keyof MonthNames]} ${year}`;
      });

      const revenueValues = last12Months.map(date => revenueByMonth[date] || 0);
      const expensesValues = last12Months.map(date => expensesByMonth[date] || 0);

      const options = setLayout();
      setOptions(options);

      return {
        labels: labels,
        datasets: [
          {
            label: 'Receitas',
            backgroundColor: 'rgba(19, 163, 0, 0.7)',
            borderColor: 'rgba(19, 163, 0, 0.7)',
            data: revenueValues,
          },
          {
            label: 'Despesas',
            backgroundColor: 'rgba(255, 0, 0, 0.7)',
            borderColor: 'rgba(255, 0, 0, 0.7)',
            data: expensesValues,
          }
        ],
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
      <Line data={data} options={options} />
    ) : (
      <span>Sem dados para exibir</span>
    )
  );
}