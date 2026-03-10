import { Revenue} from "./revenue"

export interface MonthClosing {
  id: number;
  reference: string;
  month: number;
  year: number;
  bank_value: number;
  cash_value: number;
  card_value: number;
  card_value_next_month: number;
  gross_revenue: number;
  net_revenue: number;
  expenses: number;
  profit: number;
  other_revenue: number;
  balance: number;
};

export interface MonthClosingData {
  selectedMonthClosing: MonthClosing;
  setSelectedMonthClosing: (newSelectedMonthClosing: MonthClosing) => void;
  orderedRevenue: Revenue[]
};

export type UpdateMonthClosingDTO = MonthClosing;

export interface NetValuesRevenue {
  id: number;
  net_value: number;
  date: string;
};

export interface UpdateNetValuesPayload {
  revenue: NetValuesRevenue[];
  reference: string;
};

export interface UpdateNetValuesResponse {
  month_closing: MonthClosing;
  detail: string;
};

export interface CashClosingConfirmation {
  month: string;
  year: string;
  monthNumber: number;
};

export type CashClosingFormState = {
  month: string;
  monthNumber: number;
  year: string;
  revenueCheck: boolean;
  expensesCheck: boolean;
};

export interface Rates {
  debit: number;
  cashCredit: number;
  installmentCredit: number;
};