'use client'
import { useState, useEffect } from 'react';
import Calendar from "@/app/pages/calendar/page";
import Dashboard from "@/app/pages/dashboard/page";
import Revenue from "@/app/pages/revenue/page";
import Expense from "@/app/pages/expense/page";
import MonthClosing from "@/app/pages/monthclosing/page";
import Loading from "@/app/common/loading";
import styles from "./styles/Content.module.css";
import { RevenueProps } from '@/types/revenue';
import { ExpenseProps } from '@/types/expense';
import { AgendaProps } from "@/types/agenda";
import { MonthClosingProps } from "@/types/monthClosing";
import { fetchAgenda, fetchRevenue,
  fetchExpenses, fetchMonthClosing,
  isAuthenticated, configureAxios
} from "@/utils/api";

export default function Content({ selectedOption }: { selectedOption: string }) {
  let contentComponent: React.ReactNode;
  const [revenue, setRevenue] = useState<RevenueProps[]>([]);
  const [expenses, setExpenses] = useState<ExpenseProps[]>([]);
  const [agenda, setAgenda] = useState<AgendaProps[]>([]);
  const [monthClosing, setMonthClosing] = useState<MonthClosingProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        isAuthenticated();
        configureAxios();

        const agendaData = await fetchAgenda();
        const revenueData = await fetchRevenue();
        const expenseData = await fetchExpenses();
        const monthClosingData = await fetchMonthClosing();

        if (agendaData && agendaData.length > 0) {
          setAgenda(agendaData);
        } else {
          setAgenda([]);
        }

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

        if (monthClosingData && monthClosingData.length > 0) {
          setMonthClosing(monthClosingData);
        } else {
          setMonthClosing([]);
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
      contentComponent = <Calendar agenda={agenda} setAgenda={setAgenda} />;
      break;
    case "dashboard":
      contentComponent = <Dashboard revenue={revenue} expenses={expenses} />;
      break;
    case "revenue":
      contentComponent = <Revenue revenue={revenue} setRevenue={setRevenue} loading={loading} />;
      break;
    case "expense":
      contentComponent = <Expense expenses={expenses} setExpenses={setExpenses} loading={loading} />;
      break;
    case "monthClosing":
      contentComponent = <MonthClosing revenue={revenue} setRevenue={setRevenue} monthClosing={monthClosing} setMonthClosing={setMonthClosing} />;
      break;

    default:
      contentComponent = null;
  }

  if (loading) {
    return (
      <Loading>
        Carregando...
      </Loading>
    );
  }

  return (
    <div className={styles.content}>
      {contentComponent}
    </div>
  )
}
