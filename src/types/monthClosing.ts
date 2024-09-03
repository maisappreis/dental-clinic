import { RevenueProps} from "./revenue"

export interface MonthClosingProps {
  id: number;
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

export interface DataMonthClosingProps {
  selectedMonthClosing: MonthClosingProps;
  setSelectedMonthClosing: (newSelectedMonthClosing: MonthClosingProps) => void;
  revenue: RevenueProps[];
}