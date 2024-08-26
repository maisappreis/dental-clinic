"use client";
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { fetchRevenue, fetchExpenses } from "@/utils/api";

// interface RevenueProps {
//   id: number;
//   date: string;
//   name: string;
//   cpf: string | null;
//   nf: string;
//   procedure: string;
//   payment: string;
//   installments: number | null;
//   value: number | null;
//   notes: string;
// }

// interface ExpenseProps {
//   id: number;
//   year: number;
//   month: string;
//   name: string;
//   installments: string;
//   date: string;
//   value: number;
//   is_paid: boolean;
//   notes: string;
// }

interface DataContextType {
  // revenue: RevenueProps[];
  // expenses: ExpenseProps[];
  revenue: any[];
  expenses: any[];
  setRevenue: (newRevenue: any[]) => void;
  setExpenses: (newExpenses: any[]) => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

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

        console.log("revenueData:", revenueData);
        console.log("expenseData:", expenseData);

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
  console.log("Context:", context);
  if (context === null) {
    // if (process.env.NODE_ENV === 'production') {
    //   return null;
    // }
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
