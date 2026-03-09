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

export type CreateExpenseDTO = Omit<Expense, "id">;

export type UpdateExpenseDTO = Expense;

export interface ExpenseFormData {
  id?: number;
  name: string;
  year: number;
  month: string;
  is_paid: boolean;
  installments: string;
  date: string;
  value: number;
  notes: string;
}

export interface ExpenseFormRef {
  submit: () => void;
}