
'use client'
import { useState, useEffect, useMemo } from 'react';
import { Bar } from "react-chartjs-2";
import "@/utils/chart"
import { RevenueProps, RevenueList } from '@/types/revenue';
import { ChartData } from '@/types/chart';

export default function MostPerformedProceduresChart({ revenue }: { revenue: RevenueList }) {
  const [data, setData] = useState<ChartData>({
    labels: [],
    datasets: []
  })

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

      return {
        labels: labels,
        datasets: [
          {
            label: 'Número de procedimentos realizados',
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
      <Bar data={data} />
    ) : (
      <span>Sem dados para exibir</span>
    )
  );
}