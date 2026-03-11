import { render, screen } from "@testing-library/react";
import { RevenueExpensesChart } from "./revenueExpenses";

jest.mock("react-chartjs-2", () => ({
  Line: ({ data }: any) => (
    <div data-testid="line-chart">{JSON.stringify(data)}</div>
  ),
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
    const data = {
      labels: [],
      data: {
        revenue: [],
        expense: [],
      }
    };

    render(<RevenueExpensesChart data={data} />);

    expect(screen.getByText("Sem dados para exibir")).toBeInTheDocument();
  });

  it("renders chart when there is data", () => {
    const data = {
      labels: ["Jan 2025"],
      data: {
        revenue: [1000],
        expense: [200],
      }
    };

    render(
      <RevenueExpensesChart data={data} />
    );

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("passes correct datasets to chart", () => {
    const data = {
      labels: ["Mar 2026"],
      data: {
        revenue: [100],
        expense: [50],
      }
    };

    render(
      <RevenueExpensesChart data={data} />
    );

    const chart = screen.getByTestId("line-chart");

    expect(chart.textContent).toContain("Receitas");
    expect(chart.textContent).toContain("Despesas");
    expect(chart.textContent).toContain("100");
    expect(chart.textContent).toContain("50");
  });
});