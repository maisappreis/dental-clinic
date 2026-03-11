import { render, screen } from "@testing-library/react";
import { NumberOfProceduresChart } from "./proceduresNumber";

jest.mock("react-chartjs-2", () => ({
  Line: ({ data }: any) => (
    <div data-testid="line-chart">{JSON.stringify(data)}</div>
  ),
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
    const data = {
      labels: [],
      data: [],
    };
    render(<NumberOfProceduresChart data={data} />);

    expect(screen.getByText("Sem dados para exibir")).toBeInTheDocument();
  });

  it("renders chart when there is revenue", () => {
    const data = {
      labels: ["Jan 2025", "Fev 2025"],
      data: [3, 5],
    };

    render(
      <NumberOfProceduresChart data={data} />
    );

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("passes correct labels and values to chart", () => {
    const data = {
      labels: ["Jan 2025", "Fev 2025"],
      data: [3, 5],
    };

    render(
      <NumberOfProceduresChart data={data} />
    );

    const chart = screen.getByTestId("line-chart");

    expect(chart.textContent).toContain("Jan 2025");
    expect(chart.textContent).toContain("Fev 2025");
    expect(chart.textContent).toContain("3");
    expect(chart.textContent).toContain("5");
  });
});