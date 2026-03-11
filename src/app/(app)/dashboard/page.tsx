"use client";

import { useEffect } from "react";
import styles from "@/app/(app)/dashboard/Charts.module.css";
import { RevenueExpensesChart } from "@/app/(app)/dashboard/charts/revenueExpenses";
import { ProfitChart } from "@/app/(app)/dashboard/charts/profit";
import { NumberOfProceduresChart } from "@/app/(app)/dashboard/charts/proceduresNumber";
import { MostPerformedProceduresChart } from "@/app/(app)/dashboard/charts/proceduresFrequency";
import { Spinner } from "@/components/spinner/spinner";
import { useDashboard } from "@/hooks/useDashboard";


export default function Dashboard() {
  const { dataChart, fetchDataChart, isLoading } = useDashboard({
    most_performed_procedures: {
      labels: [],
      data: [],
    },
    number_of_procedures: {
      labels: [],
      data: [],
    },
    monthly_profit: {
      labels: [],
      data: [],
    },
    revenue_versus_expense:{
      labels: [],
      data: {
        revenue: [],
        expense: [],
      }
    }
  });

  useEffect(() => {
    fetchDataChart();
  }, [fetchDataChart]);

  return (
    <div className={styles.chartarea}>
      <div className={styles.chartitem}>
        {isLoading ? (
          <Spinner/>
        ) : (
          <RevenueExpensesChart data={dataChart.revenue_versus_expense} />
        )}
      </div>
      <div className={styles.chartitem}>
        {isLoading ? (
          <Spinner/>
        ) : (
          <MostPerformedProceduresChart data={dataChart.most_performed_procedures} />
        )}
      </div>
      <div className={styles.chartitem}>
        {isLoading ? (
          <Spinner/>
        ) : (
          <NumberOfProceduresChart data={dataChart.number_of_procedures} />
        )}
      </div>
      <div className={styles.chartitem}>
        {isLoading ? (
          <Spinner/>
        ) : (
          <ProfitChart data={dataChart.monthly_profit} />
        )}
      </div>
    </div>
  );
};


