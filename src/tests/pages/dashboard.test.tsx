import { render, screen } from "@testing-library/react";
import Dashboard from "@/app/pages/dashboard/page";
import { RevenueList } from '@/types/revenue';
import { ExpenseList } from '@/types/expense';

jest.mock('@/app/charts/revenue', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="RevenueExpensesChart" />)
}));

jest.mock('@/app/charts/profit', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="ProfitChart" />)
}));

jest.mock('@/app/charts/proceduresNumber', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="NumberOfProceduresChart" />)
}));

jest.mock('@/app/charts/proceduresFrequency', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="MostPerformedProceduresChart" />)
}));

jest.mock('@/app/pages/dashboard/Charts.module.css', () => ({
  area: 'mock-area-class',
}));

describe("Dashboard Component", () => {
  const mockRevenue: RevenueList = [
    {
      id: 1, date: "2024-01-01", release_date: "2024-09-01", name: "Paciente X",
      cpf: "000.000.000-11", nf: "no", procedure: "Restauração", payment: "Dinheiro",
      installments: 0, value: 1000, net_value: 100, notes: "string"
    },
    {
      id: 2, date: "2024-01-02", release_date: "2024-09-15", name: "Paciente Y",
      cpf: "000.000.000-11", nf: "no", procedure: "Restauração", payment: "Dinheiro",
      installments: 0, value: 1500, net_value: 200, notes: "string"
    },
  ];

  const mockExpenses: ExpenseList = [
    {
      id: 1, year: 2024, month: "Setembro", name: "Aluguel", installments: "",
      date: "2024-01-01", value: 500, is_paid: false, notes: ""
    },
    {
      id: 2, year: 2024, month: "Setembro", name: "Aluguel", installments: "",
      date: "2024-01-02", value: 700, is_paid: false, notes: ""
    },
  ];

  it("renders all charts correctly", () => {
    render(<Dashboard revenue={mockRevenue} expenses={mockExpenses} />);

    expect(screen.getByTestId("RevenueExpensesChart")).toBeInTheDocument();
    expect(screen.getByTestId("MostPerformedProceduresChart")).toBeInTheDocument();
    expect(screen.getByTestId("NumberOfProceduresChart")).toBeInTheDocument();
    expect(screen.getByTestId("ProfitChart")).toBeInTheDocument();
  });

  it("passes the correct props to each chart", () => {
    render(<Dashboard revenue={mockRevenue} expenses={mockExpenses} />);

    expect(screen.getByTestId("RevenueExpensesChart")).toBeInTheDocument();
    expect(screen.getByTestId("MostPerformedProceduresChart")).toBeInTheDocument();
    expect(screen.getByTestId("NumberOfProceduresChart")).toBeInTheDocument();
    expect(screen.getByTestId("ProfitChart")).toBeInTheDocument();
  });

  it("renders two chart areas with the correct class", () => {
    const { container } = render(<Dashboard revenue={mockRevenue} expenses={mockExpenses} />);
    
    const areas = container.querySelectorAll('#area');
    expect(areas.length).toBe(2);
  });
});