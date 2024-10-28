import {
  capitalize,
  calculateMonthlyRevenue,
  calculateMonthlyTotals,
  calculateMonthlyProfit,
  formatValueToBRL
} from "@/utils/utils";
import { type RevenueProps} from '@/types/revenue';
import { type ExpenseProps } from '@/types/expense';

const mockRevenueData: RevenueProps[] = [
  {
    id: 1, date: "2024-09-01", release_date: "2024-09-01", name: "Paciente X",
    cpf: "000.000.000-11", nf: "no", procedure: "Restauração", payment: "Dinheiro",
    installments: 0, value: 150, net_value: 100, notes: "string"
  },
  {
    id: 2, date: "2024-09-15", release_date: "2024-09-15", name: "Paciente Y",
    cpf: "000.000.000-11", nf: "no", procedure: "Restauração", payment: "Dinheiro",
    installments: 0, value: 250, net_value: 200, notes: "string"
  },
  {
    id: 3, date: "2024-09-20", release_date: "2024-09-20", name: "Paciente Z",
    cpf: "000.000.000-11", nf: "no", procedure: "Restauração", payment: "Dinheiro",
    installments: 0, value: 350, net_value: 300, notes: "string"
  }
];

const mockExpenseData: ExpenseProps[] = [
  {
    id: 1, year: 2024, month: "Setembro", name: "Aluguel", installments: "",
    date: "2024-09-05", value: 100, is_paid: false, notes: ""
  },
  {
    id: 2, year: 2024, month: "Setembro", name: "Aluguel", installments: "",
    date: "2024-09-10", value: 80, is_paid: false, notes: ""
  },
  {
    id: 3, year: 2024, month: "Setembro", name: "Aluguel", installments: "",
    date: "2024-09-15", value: 50, is_paid: false, notes: ""
  }
];

describe("Utils Functions", () => {

  it("capitalize should capitalize the first letter of each word", () => {
    expect(capitalize("hello world")).toBe("Hello World");
    expect(capitalize("javaScript is awesome")).toBe("Javascript Is Awesome");
  });

  it("calculateMonthlyRevenue should return the total revenue for a specific month and year", () => {
    const result = calculateMonthlyRevenue(mockRevenueData, 9, 2024);
    expect(result).toBe(500);
  });

  it("calculateMonthlyTotals should return the correct monthly revenue and expenses", () => {
    const result = calculateMonthlyTotals(mockRevenueData, mockExpenseData);
    expect(result.monthsLabels).toContain("Setembro 2024");
    expect(result.monthlyRevenue).toContain(750);
    expect(result.monthlyExpenses).toContain(230);
  });

  it("calculateMonthlyProfit should return the correct monthly profit", () => {
    const result = calculateMonthlyProfit(mockRevenueData, mockExpenseData);
    expect(result.monthsLabels).toContain("Setembro 2024");
    expect(result.monthlyProfit).toContain(520);
  });

  it("formatValueToBRL should format number to BRL currency", () => {
    expect(formatValueToBRL(1234.56)).toBe("R$ 1.234,56");
    expect(formatValueToBRL(0)).toBe("R$ 0,00");
    expect(formatValueToBRL(NaN)).toBe("");
  });

});
