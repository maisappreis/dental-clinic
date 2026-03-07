import { render, screen } from "@testing-library/react";
import { MostPerformedProceduresChart } from "./proceduresFrequency";

jest.mock("react-chartjs-2", () => ({
  Bar: ({ data }: any) => (
    <div data-testid="bar-chart">{JSON.stringify(data)}</div>
  ),
}));

jest.mock("@/utils/charts", () => ({
  getMostPerformedProcedures: jest.fn(),
}));

jest.mock("@/constants/charts", () => ({
  proceduresBarChartOptions: {},
}));

import { getMostPerformedProcedures } from "@/utils/charts";

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
    render(<MostPerformedProceduresChart revenue={[]} />);

    expect(screen.getByText("Sem dados para exibir")).toBeInTheDocument();
  });

  it("renders chart when there is revenue", () => {
    (getMostPerformedProcedures as jest.Mock).mockReturnValue([
      ["Limpeza", 3],
      ["Extração", 2],
    ]);

    render(
      <MostPerformedProceduresChart
        revenue={[{ procedure: "Limpeza" } as any]}
      />
    );

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("passes correct labels and data to chart", () => {
    (getMostPerformedProcedures as jest.Mock).mockReturnValue([
      ["Limpeza", 3],
      ["Extração", 2],
    ]);

    render(
      <MostPerformedProceduresChart
        revenue={[{ procedure: "Limpeza" } as any]}
      />
    );

    const chart = screen.getByTestId("bar-chart");

    expect(chart.textContent).toContain("Limpeza");
    expect(chart.textContent).toContain("Extração");
    expect(chart.textContent).toContain("3");
    expect(chart.textContent).toContain("2");
  });
});