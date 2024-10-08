"use client";
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { fetchRevenue, fetchExpenses } from "@/utils/api";

interface RevenueProps {
  id: number;
  date: string;
  name: string;
  cpf: string | null;
  nf: string;
  procedure: string;
  payment: string;
  installments: number | null;
  value: number | null;
  notes: string;
}

interface ExpenseProps {
  id: number;
  year: number;
  month: string;
  name: string;
  installments: string;
  date: string;
  value: number;
  is_paid: boolean;
  notes: string;
}

interface DataContextType {
  revenue: RevenueProps[];
  expenses: ExpenseProps[];
  setRevenue: (newRevenue: any[]) => void;
  setExpenses: (newExpenses: any[]) => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [revenue, setRevenue] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
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

  return (
    <DataContext.Provider value={{ revenue, expenses, loading, setRevenue, setExpenses }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
