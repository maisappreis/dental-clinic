"use client";

import { useEffect } from "react";
import styles from "@/app/(app)/dashboard/Charts.module.css";
import { RevenueExpensesChart } from "@/app/(app)/dashboard/charts/revenueExpenses";
import { ProfitChart } from "@/app/(app)/dashboard/charts/profit";
import { NumberOfProceduresChart } from "@/app/(app)/dashboard/charts/proceduresNumber";
import { MostPerformedProceduresChart } from "@/app/(app)/dashboard/charts/proceduresFrequency";
import { Spinner } from "@/components/spinner/spinner";
import { useRevenue } from "@/hooks/useRevenue";
import { useExpense } from "@/hooks/useExpense";
import { useProfit } from "@/hooks/useProfit";


export default function Dashboard() {
  const { revenue, fetchRevenue, isLoading: isLoadingRevenue } = useRevenue([]);
  const { expenses, fetchExpenses, isLoading: isLoadingExpenses } = useExpense([]);
  const { profit, fetchProfit, isLoading: isLoadingProfit } = useProfit({profit: [], labels: []});

  useEffect(() => {
    fetchRevenue();
    fetchExpenses();
    fetchProfit();
  }, [fetchRevenue, fetchExpenses, fetchProfit]);

  return (
    <div className={styles.chartarea}>
      <div className={styles.chartitem}>
        {isLoadingRevenue && isLoadingExpenses ? (
          <Spinner/>
        ) : (
          <RevenueExpensesChart revenue={revenue} expenses={expenses} />
        )}
      </div>
      <div className={styles.chartitem}>
        {isLoadingRevenue ? (
          <Spinner/>
        ) : (
          <MostPerformedProceduresChart revenue={revenue} />
        )}
      </div>
      <div className={styles.chartitem}>
        {isLoadingRevenue ? (
          <Spinner/>
        ) : (
          <NumberOfProceduresChart revenue={revenue} />
        )}
      </div>
      <div className={styles.chartitem}>
        {isLoadingProfit ? (
          <Spinner/>
        ) : (
          <ProfitChart profit={profit} />
        )}
      </div>
    </div>
  );
};


