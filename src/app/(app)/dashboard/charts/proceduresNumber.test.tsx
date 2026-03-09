import { render, screen } from "@testing-library/react";
import { NumberOfProceduresChart } from "./proceduresNumber";

jest.mock("react-chartjs-2", () => ({
  Line: ({ data }: any) => (
    <div data-testid="line-chart">{JSON.stringify(data)}</div>
  ),
}));

jest.mock("@/utils/charts", () => ({
  groupRevenueByMonth: jest.fn(),
}));

jest.mock("@/constants/charts", () => ({
  proceduresLineChartOptions: {},
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

import { groupRevenueByMonth } from "@/utils/charts";

describe("NumberOfProceduresChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, "getComputedStyle", {
      value: () => ({
        getPropertyValue: () => "#000",
      }),
    });
  });

  it("renders empty message when no revenue", () => {
    render(<NumberOfProceduresChart revenue={[]} />);

    expect(screen.getByText("Sem dados para exibir")).toBeInTheDocument();
  });

  it("renders chart when there is revenue", () => {
    (groupRevenueByMonth as jest.Mock).mockReturnValue({
      "2025-01": 3,
      "2025-02": 5,
    });

    render(
      <NumberOfProceduresChart revenue={[{ date: "2025-01-01" } as any]} />
    );

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("passes correct labels and values to chart", () => {
    (groupRevenueByMonth as jest.Mock).mockReturnValue({
      "2025-01": 3,
      "2025-02": 5,
    });

    render(
      <NumberOfProceduresChart revenue={[{ date: "2025-01-01" } as any]} />
    );

    const chart = screen.getByTestId("line-chart");

    expect(chart.textContent).toContain("Jan 2025");
    expect(chart.textContent).toContain("Fev 2025");
    expect(chart.textContent).toContain("3");
    expect(chart.textContent).toContain("5");
  });
});