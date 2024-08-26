export interface RevenueProps {
  id: number;
  date: string;
  name: string;
  cpf: string;
  nf: string;
  procedure: string;
  payment: string;
  installments: number;
  value: number;
  notes: string;
}

export interface DataRevenueProps {
  revenue: RevenueProps[];
  setRevenue: (newRevenue: RevenueProps[]) => void;
  loading: boolean;
}