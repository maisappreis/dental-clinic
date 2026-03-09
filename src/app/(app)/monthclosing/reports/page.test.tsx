import { render, screen, fireEvent } from "@testing-library/react";
import Reports from "./page";

const mockFetchMonthClosing = jest.fn();
const mockStartFromExisting = jest.fn();
const mockStartNew = jest.fn();

jest.mock("@/components/button/button", () => ({
  Button: ({ label, onClick }: any) => (
    <button onClick={onClick}>{label}</button>
  ),
}));

jest.mock("@/components/form/select", () => ({
  Select: ({ value, options, onChange }: any) => (
    <select
      data-testid="year-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("@/components/spinner/spinner", () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

jest.mock("@/components/message/message", () => ({
  MessageCard: ({ title }: any) => <div>{title}</div>,
}));

jest.mock("@/app/(app)/monthclosing/reports/modal", () => ({
  CashClosingModal: ({ open, onClose, onConfirmation }: any) =>
    open ? (
      <div data-testid="cash-closing-modal">
        <button
          onClick={() =>
            onConfirmation({ month: "Janeiro", year: "2025", monthNumber: 1 })
          }
        >
          confirm
        </button>
        <button onClick={onClose}>close</button>
      </div>
    ) : null,
}));

jest.mock("@/constants/date", () => ({
  years: [2024, 2025],
}));

jest.mock("@/utils/date", () => ({
  getCurrentYear: () => 2025,
}));

jest.mock("@/hooks/useMonthClosing", () => ({
  useMonthClosing: () => ({
    monthClosing: [
      {
        id: 1,
        reference: "Janeiro 2025",
      },
    ],
    fetchMonthClosing: mockFetchMonthClosing,
    isLoading: false,
  }),
}));

jest.mock("@/hooks/useMonthClosingStart", () => ({
  useMonthClosingStart: () => ({
    startFromExisting: mockStartFromExisting,
    startNew: mockStartNew,
  }),
}));

describe("Reports", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders existing reports", () => {
    render(<Reports />);

    expect(screen.getByText("Janeiro 2025")).toBeInTheDocument();
  });

  it("calls fetchMonthClosing on mount", () => {
    render(<Reports />);

    expect(mockFetchMonthClosing).toHaveBeenCalledWith(2025);
  });

  it("opens existing report when clicked", () => {
    render(<Reports />);

    fireEvent.click(screen.getByText("Janeiro 2025"));

    expect(mockStartFromExisting).toHaveBeenCalled();
  });

  it("opens modal when clicking new closing", () => {
    render(<Reports />);

    fireEvent.click(screen.getByText("Novo Fechamento"));

    expect(screen.getByTestId("cash-closing-modal")).toBeInTheDocument();
  });

  it("starts new report after confirmation", () => {
    render(<Reports />);

    fireEvent.click(screen.getByText("Novo Fechamento"));
    fireEvent.click(screen.getByText("confirm"));

    expect(mockStartNew).toHaveBeenCalled();
  });

  it("changes year filter", () => {
    render(<Reports />);

    const select = screen.getByTestId("year-select");

    fireEvent.change(select, { target: { value: "2024" } });

    expect(select).toHaveValue("2024");
  });
});