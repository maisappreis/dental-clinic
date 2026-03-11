import { render, screen } from "@testing-library/react";
import { MostPerformedProceduresChart } from "./proceduresFrequency";

jest.mock("react-chartjs-2", () => ({
  Bar: ({ data }: any) => (
    <div data-testid="bar-chart">{JSON.stringify(data)}</div>
  ),
}));

jest.mock("@/constants/charts", () => ({
  proceduresBarChartOptions: {},
}));

describe("MostPerformedProceduresChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, "getComputedStyle", {
      value: () => ({
        getPropertyValue: () => "#000",
      }),
    });
  });

  it("renders empty message when no revenue", () => {
    const data = {
      labels: [],
      data: [],
    };

    render(<MostPerformedProceduresChart data={data} />);

    expect(screen.getByText("Sem dados para exibir")).toBeInTheDocument();
  });

  it("renders chart when there is revenue", () => {
    const data = {
      labels: ["Limpeza"],
      data: [3],
    };

    render(
      <MostPerformedProceduresChart
        data={data}
      />
    );

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("passes correct labels and data to chart", () => {
    const data = {
      labels: ["Limpeza", "Extração"],
      data: [3, 2],
    };

    render(
      <MostPerformedProceduresChart
        data={data}
      />
    );

    const chart = screen.getByTestId("bar-chart");

    expect(chart.textContent).toContain("Limpeza");
    expect(chart.textContent).toContain("Extração");
    expect(chart.textContent).toContain("3");
    expect(chart.textContent).toContain("2");
  });
});