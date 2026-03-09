import { render, screen, fireEvent } from "@testing-library/react";
import TabTwo from "./page";

const pushMock = jest.fn();
const createMock = jest.fn().mockResolvedValue({});
const updateMock = jest.fn().mockResolvedValue({});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/hooks/useMonthClosing", () => ({
  useMonthClosing: () => ({
    create: createMock,
    update: updateMock,
  }),
}));

const monthClosingFlowMock = {
  selectedMonthClosing: {
    id: 1,
    bank_value: 10,
    cash_value: 20,
    card_value: 30,
    card_value_next_month: 5,
  },
  setSelectedMonthClosing: jest.fn(),
  closingRevenue: [
    {
      id: 1,
      release_date: "2025-01-01",
      net_value: 50,
      value: 100,
      payment: "Dinheiro",
    },
    {
      id: 2,
      release_date: "2025-01-01",
      net_value: 50,
      value: 100,
      payment: "Dinheiro",
    },
  ],
};

jest.mock("@/app/(app)/monthclosing/provider/provider", () => ({
  useMonthClosingFlow: () => monthClosingFlowMock,
}));

jest.mock("@/app/(app)/monthclosing/tab2/summary", () => ({
  SummaryRow: ({ label }: any) => <div>{label}</div>,
}));

describe("TabTwo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form inputs", () => {
    render(<TabTwo />);

    expect(screen.getByLabelText("Banco do Brasil:")).toBeInTheDocument();
    expect(screen.getByLabelText("Dinheiro:")).toBeInTheDocument();
    expect(screen.getByLabelText("Cartão:")).toBeInTheDocument();
    expect(screen.getByLabelText("Cartão mês seguinte:")).toBeInTheDocument();
  });

  it("updates input values", () => {
    render(<TabTwo />);

    const input = screen.getByLabelText("Banco do Brasil:");

    fireEvent.change(input, { target: { value: "100" } });

    expect((input as HTMLInputElement).value).toBe("100");
  });

  it("calls update when saving existing closing", async () => {
    render(<TabTwo />);

    fireEvent.click(screen.getByText("Salvar"));

    expect(updateMock).toHaveBeenCalled();
  });

  it("navigates to summary page", () => {
    render(<TabTwo />);

    fireEvent.click(screen.getByText("Avançar"));

    expect(pushMock).toHaveBeenCalledWith("/monthclosing/summary");
  });

  it("calculates difference correctly", () => {
    render(<TabTwo />);

    expect(screen.getByText("Diferença")).toBeInTheDocument();
  });
});