export interface MonthClosingProps {
  reference: string;
  month: number;
  year: number;
  bank_value: number;
  cash_value: number;
  card_value: number;
  gross_revenue: number;
  net_revenue: number;
  expenses: number;
  profit: number;
  other_revenue: number;
  balance: number;
}

export type MonthClosingList = MonthClosingProps[];