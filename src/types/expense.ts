export interface ExpenseProps {
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

export interface ExpenseData {
  expenses: ExpenseProps[];
  setExpenses: (newExpenses: ExpenseProps[]) => void;
  loading: boolean;
}