import { render, screen } from "@testing-library/react";
import { RevenueExpensesChart } from "./revenueExpenses";

jest.mock("react-chartjs-2", () => ({
  Line: ({ data }: any) => (
    <div data-testid="line-chart">{JSON.stringify(data)}</div>
  ),
}));

jest.mock("@/utils/charts", () => ({
  groupValuesByMonth: jest.fn(),
}));

jest.mock("@/constants/charts", () => ({
  revenueExpensesLineChartOptions: {},
}));

jest.mock("@/constants/date", () => ({
  monthNames: {
    "01": "Jan",
    "02": "Fev",
    "03": "Mar",
    "04": "Abr",
    "05": "Mai",
    "06": "Jun",
    "07": "Jul",
    "08": "Ago",
    "09": "Set",
    "10": "Out",
    "11": "Nov",
    "12": "Dez",
  },
}));

import { groupValuesByMonth } from "@/utils/charts";

describe("RevenueExpensesChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, "getComputedStyle", {
      value: () => ({
        getPropertyValue: (prop: string) => {
          if (prop === "--success-color") return "#0f0";
          if (prop === "--error-color") return "#f00";
          return "#000";
        },
      }),
    });
  });

  it("renders empty message when no data", () => {
    render(<RevenueExpensesChart revenue={[]} expenses={[]} />);

    expect(screen.getByText("Sem dados para exibir")).toBeInTheDocument();
  });

  it("renders chart when there is data", () => {
    (groupValuesByMonth as jest.Mock).mockReturnValue({
      "2025-01": 100,
    });

    render(
      <RevenueExpensesChart
        revenue={[{ date: "2025-01-01" } as any]}
        expenses={[{ date: "2025-01-01" } as any]}
      />
    );

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("passes correct datasets to chart", () => {
    (groupValuesByMonth as jest.Mock)
      .mockReturnValueOnce({ "2026-03": 100 })
      .mockReturnValueOnce({ "2026-03": 50 });

    render(
      <RevenueExpensesChart
        revenue={[{ date: "2026-03-01" } as any]}
        expenses={[{ date: "2026-03-01" } as any]}
      />
    );

    const chart = screen.getByTestId("line-chart");

    expect(chart.textContent).toContain("Receitas");
    expect(chart.textContent).toContain("Despesas");
    expect(chart.textContent).toContain("100");
    expect(chart.textContent).toContain("50");
  });
});