export interface Revenue {
  id: number;
  date: string;
  release_date: string;
  name: string;
  cpf: string;
  nf: boolean;
  procedure: string;
  payment: string;
  installments: number;
  value: number;
  net_value: number;
  notes: string;
};

export type CreateRevenueDTO =
  Omit<Revenue, "id" | "release_date" | "net_value">;

export type UpdateRevenueDTO = Revenue;

export interface RevenueFormData {
  id?: number;
  date: string;
  name: string;
  cpf: string;
  nf: boolean;
  procedure: string;
  payment: string;
  installments: number;
  value: number;
  notes: string;
};

export interface RevenueFormRef {
  submit: () => void;
};