import { render, screen } from "@testing-library/react";
import { ProfitChart } from "./profit";

jest.mock("react-chartjs-2", () => ({
  Bar: ({ data }: any) => (
    <div data-testid="bar-chart">{JSON.stringify(data)}</div>
  ),
}));

jest.mock("@/constants/charts", () => ({
  profitBarChartOptions: {},
}));

describe("ProfitChart", () => {
  beforeEach(() => {
    Object.defineProperty(window, "getComputedStyle", {
      value: () => ({
        getPropertyValue: () => "#123",
      }),
    });
  });

  it("renders empty message when no data", () => {
    render(
      <ProfitChart
        profit={{
          labels: [],
          profit: [],
        }}
      />
    );

    expect(screen.getByText("Sem dados para exibir")).toBeInTheDocument();
  });

  it("renders chart when data exists", () => {
    render(
      <ProfitChart
        profit={{
          labels: ["Jan", "Fev"],
          profit: [1000, 2000],
        }}
      />
    );

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("passes correct labels and values to chart", () => {
    render(
      <ProfitChart
        profit={{
          labels: ["Jan", "Fev"],
          profit: [1000, 2000],
        }}
      />
    );

    const chart = screen.getByTestId("bar-chart");

    expect(chart.textContent).toContain("Jan");
    expect(chart.textContent).toContain("Fev");
    expect(chart.textContent).toContain("1000");
    expect(chart.textContent).toContain("2000");
  });
});