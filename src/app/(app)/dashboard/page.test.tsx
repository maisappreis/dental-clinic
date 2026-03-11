import { render, screen } from "@testing-library/react";
import Dashboard from "./page";

jest.mock("@/app/(app)/dashboard/Charts.module.css", () => ({
  chartarea: "chartarea",
  chartitem: "chartitem",
}));

jest.mock("@/app/(app)/dashboard/charts/revenueExpenses", () => ({
  RevenueExpensesChart: () => <div>RevenueExpensesChart</div>,
}));

jest.mock("@/app/(app)/dashboard/charts/proceduresFrequency", () => ({
  MostPerformedProceduresChart: () => <div>MostPerformedProceduresChart</div>,
}));

jest.mock("@/app/(app)/dashboard/charts/proceduresNumber", () => ({
  NumberOfProceduresChart: () => <div>NumberOfProceduresChart</div>,
}));

jest.mock("@/app/(app)/dashboard/charts/profit", () => ({
  ProfitChart: () => <div>ProfitChart</div>,
}));

const fetchDataChart = jest.fn();

jest.mock("@/hooks/useDashboard", () => ({
  useDashboard: () => ({
    dataChart: [],
    fetchDataChart,
  }),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all charts", () => {
    render(<Dashboard />);

    expect(screen.getByText("RevenueExpensesChart")).toBeInTheDocument();
    expect(screen.getByText("MostPerformedProceduresChart")).toBeInTheDocument();
    expect(screen.getByText("NumberOfProceduresChart")).toBeInTheDocument();
    expect(screen.getByText("ProfitChart")).toBeInTheDocument();
  });

  it("calls fetch functions on mount", () => {
    render(<Dashboard />);

    expect(fetchDataChart).toHaveBeenCalled();
  });
});