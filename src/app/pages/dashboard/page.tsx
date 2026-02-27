"use client";
import React, { useEffect } from "react";

import styles from "@/app/pages/dashboard/Charts.module.css";
import RevenueExpensesChart from "@/app/charts/revenue";
import ProfitChart from "@/app/charts/profit";
import NumberOfProceduresChart from "@/app/charts/proceduresNumber";
import MostPerformedProceduresChart from "@/app/charts/proceduresFrequency";
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
    <div className="content align-middle">
      <div id="area" className={styles.area}>
        <RevenueExpensesChart revenue={revenue} expenses={expenses} />
        <MostPerformedProceduresChart revenue={revenue} />
      </div>
      <div id="area" className={styles.area}>
        <NumberOfProceduresChart revenue={revenue} />
        <ProfitChart profit={profit} />
      </div>
    </div>
  );
};


