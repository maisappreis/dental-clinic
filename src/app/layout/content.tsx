'use client'
import { useState, useEffect } from 'react';
import Calendar from "@/app/pages/calendar/page";
import Dashboard from "@/app/pages/dashboard/page";
import Revenue from "@/app/pages/revenue/page";
import Expense from "@/app/pages/expense/page";
import MonthEndClosing from "@/app/pages/monthclosing/page";
import style from "./styles/Content.module.css";
import { fetchRevenue, fetchExpenses, isAuthenticated, configureAxios } from "@/utils/api";
import { RevenueProps } from '@/types/revenue';
import { ExpenseProps } from '@/types/expense';

export default function Content({ selectedOption }: { selectedOption: string }) {
  let contentComponent: React.ReactNode;
  const [revenue, setRevenue] = useState<RevenueProps[]>([]);
  const [expenses, setExpenses] = useState<ExpenseProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        isAuthenticated();
        configureAxios();

        const revenueData = await fetchRevenue();
        const expenseData = await fetchExpenses();

        if (revenueData && revenueData.length > 0) {
          setRevenue(revenueData);
        } else {
          setRevenue([]);
        }

        if (expenseData && expenseData.length > 0) {
          setExpenses(expenseData);
        } else {
          setExpenses([]);
        }       
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  switch (selectedOption) {
    case "calendar":
      contentComponent = <Calendar />;
      break;
    case "dashboard":
      contentComponent = <Dashboard />;
      break;
    case "revenue":
      contentComponent = <Revenue revenue={revenue} setRevenue={setRevenue} loading={loading} />;
      break;
    case "expense":
      contentComponent = <Expense expenses={expenses} setExpenses={setExpenses} loading={loading} />;
      break;
    case "monthEndClosing":
      contentComponent = <MonthEndClosing />;
      break;

    default:
      contentComponent = null;
  }

  return (
    <div className={style.content}>
      {contentComponent}
    </div>
  )
}
