import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TabOne from "./page";

const pushMock = jest.fn();
const updateNetValuesMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/app/(app)/monthclosing/tab1/form/form", () => ({
  RatesForm: ({ onChange }: any) => (
    <button
      data-testid="change-rates"
      onClick={() =>
        onChange({
          debit: 2,
          cashCredit: 4,
          installmentCredit: 5,
        })
      }
    >
      change rates
    </button>
  ),
}));

jest.mock("@/app/(app)/monthclosing/tab1/table/table", () => ({
  TabOneTable: ({ data, actions }: any) => (
    <div>
      {data.map((r: any, i: number) => (
        <input
          key={r.id}
          data-testid={`net-${i}`}
          value={r.net_value}
          onChange={(e) => actions.onInputChange(e, i)}
        />
      ))}
    </div>
  ),
}));

jest.mock("@/hooks/useMonthClosing", () => ({
  useMonthClosing: () => ({
    updateNetValues: updateNetValuesMock,
  }),
}));

jest.mock("@/app/(app)/monthclosing/provider/provider", () => ({
  useMonthClosingFlow: () => ({
    selectedMonthClosing: {
      id: 1,
      bank_value: 0,
      cash_value: 0,
      card_value: 0,
      card_value_next_month: 0,
    },
    setSelectedMonthClosing: jest.fn(),
    closingRevenue: [
      {
        net_value: 100,
      },
    ],
  }),
}));

jest.mock(
  "@/app/(app)/monthclosing/domain/tab1Utils",
  () => ({
    orderRevenue: (data: any) => data,
    calculateNetRevenue: (data: any) =>
      data.map((r: any) => ({ ...r, net_value: 90 })),
  })
);

describe("TabOne", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table when revenue exists", () => {
    render(<TabOne />);

    expect(screen.getByTestId("net-0")).toBeInTheDocument();
  });

  it("updates net value when input changes", () => {
    render(<TabOne />);

    const input = screen.getByTestId("net-0");

    fireEvent.change(input, { target: { value: "80" } });

    expect((input as HTMLInputElement).value).toBe("80");
  });

  it("saves revenue", async () => {
    render(<TabOne />);

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(updateNetValuesMock).toHaveBeenCalled();
    });
  });

  it("navigates to next tab", () => {
    render(<TabOne />);

    fireEvent.click(screen.getByText("Avançar"));

    expect(pushMock).toHaveBeenCalledWith("/monthclosing/tab2");
  });

  it("changes rates", () => {
    render(<TabOne />);

    fireEvent.click(screen.getByTestId("change-rates"));

    expect(screen.getByTestId("net-0")).toBeInTheDocument();
  });
});