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

export type CreateExpenseDTO =
  Omit<Expense, "id" | "year" | "month" | "is_paid"> & {
    hasInstallments: boolean;
};

export type UpdateExpenseDTO = Expense & {
  hasInstallments: boolean;
};

export interface ExpenseFormData {
  id?: number;
  name: string;
  hasInstallments: boolean;
  installments: string;
  date: string;
  value: number;
  notes: string;
}

export interface ExpenseFormRef {
  submit: () => void;
}