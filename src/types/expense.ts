export interface Expense {
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
  expenses: Expense[];
  setExpenses: (newExpenses: Expense[]) => void;
  loading: boolean;
}