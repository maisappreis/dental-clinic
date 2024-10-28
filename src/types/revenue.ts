export interface RevenueProps {
  id: number;
  date: string;
  release_date: string;
  name: string;
  cpf: string;
  nf: "yes" | "no";
  procedure: string;
  payment: string;
  installments: number;
  value: number;
  net_value: number;
  notes: string;
}

export interface RevenueData {
  revenue: RevenueProps[];
  setRevenue: (newRevenue: RevenueProps[]) => void;
  loading: boolean;
}