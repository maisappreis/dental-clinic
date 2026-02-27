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

// TODO: Enviando dados zerados para o back, que retorna com dados preenchidos
// Correto era nem enviar zerado

// export type CreateMonthClosingDTO =
//   Omit<MonthClosing, "id" | "gross_revenue" | "net_revenue" | "expenses" | "profit" | "other_revenue" | "balance">;

export type CreateMonthClosingDTO = MonthClosing;

export type UpdateMonthClosingDTO = MonthClosing;

export interface UpdateNetValuesPayload {
  id: number;
  net_value: number;
  date: string;
};