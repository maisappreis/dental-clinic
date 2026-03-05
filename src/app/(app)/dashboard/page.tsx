"use client";
import React, { useEffect } from "react";

import styles from "@/app/(app)/dashboard/Charts.module.css";
import { RevenueExpensesChart } from "@/app/(app)/dashboard/charts/revenue";
import { ProfitChart } from "@/app/(app)/dashboard/charts/profit";
import { NumberOfProceduresChart } from "@/app/(app)/dashboard/charts/proceduresNumber";
import { MostPerformedProceduresChart } from "@/app/(app)/dashboard/charts/proceduresFrequency";
import { useRevenue } from "@/hooks/useRevenue";
import { useExpense } from "@/hooks/useExpense";
import { useProfit } from "@/hooks/useProfit";


export default function Dashboard() {
  const { revenue, fetchRevenue } = useRevenue([]);
  const { expenses, fetchExpenses } = useExpense([]);
  const { profit, fetchProfit } = useProfit({profit: [], labels: []});

  useEffect(() => {
    fetchRevenue();
    fetchExpenses();
    fetchProfit();
  }, [fetchRevenue, fetchExpenses, fetchProfit]);

  return (
    <div className={styles.chartarea}>
      <div className={styles.chartitem}>
        <RevenueExpensesChart revenue={revenue} expenses={expenses} />
      </div>
      <div className={styles.chartitem}>
        <MostPerformedProceduresChart revenue={revenue} />
      </div>
      <div className={styles.chartitem}>
        <NumberOfProceduresChart revenue={revenue} />
      </div>
      <div className={styles.chartitem}>
        <ProfitChart profit={profit} />
      </div>
    </div>
  );
};


