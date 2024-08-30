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

export type ExpenseList = ExpenseProps[];

export interface DataExpenseProps {
  expenses: ExpenseProps[];
  setExpenses: (newExpenses: ExpenseProps[]) => void;
  loading: boolean;
}