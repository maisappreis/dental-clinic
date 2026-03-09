import { render, screen, fireEvent } from "@testing-library/react";
import { CashClosingModal } from "./modal";

jest.mock("@/components/form/select", () => ({
  Select: ({ value, options, onChange }: any) => (
    <select
      data-testid="select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">-</option>
      {options.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("@/constants/date", () => ({
  months: ["Janeiro", "Fevereiro"],
  years: [2025, 2026],
}));

jest.mock("@/utils/date", () => ({
  getNextMonthName: (m: string) => (m === "Janeiro" ? "Fevereiro" : "Março"),
}));

jest.mock(
  "@/app/(app)/monthclosing/domain/reportsUtils",
  () => ({
    getDefaultCashClosingForm: () => ({
      month: "",
      monthNumber: 0,
      year: "",
      revenueCheck: false,
      expensesCheck: false,
    }),
  })
);

describe("CashClosingModal", () => {
  const onConfirmation = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal content", () => {
    render(
      <CashClosingModal
        open={true}
        onConfirmation={onConfirmation}
        onClose={onClose}
      />
    );

    expect(
      screen.getByText("Fechamento de caixa referente ao mês:")
    ).toBeInTheDocument();
  });

  it("changes month and year", () => {
    render(
      <CashClosingModal
        open={true}
        onConfirmation={onConfirmation}
        onClose={onClose}
      />
    );

    const selects = screen.getAllByTestId("select");

    fireEvent.change(selects[0], { target: { value: "Janeiro" } });
    fireEvent.change(selects[1], { target: { value: "2025" } });

    expect(selects[0]).toHaveValue("Janeiro");
    expect(selects[1]).toHaveValue("2025");
  });

  it("enables confirm button when both checkboxes are checked", () => {
    render(
      <CashClosingModal
        open={true}
        onConfirmation={onConfirmation}
        onClose={onClose}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    const confirmButton = screen.getByText("Confirmar");

    expect(confirmButton).not.toBeDisabled();
  });

  it("calls onConfirmation when confirming", () => {
    render(
      <CashClosingModal
        open={true}
        onConfirmation={onConfirmation}
        onClose={onClose}
      />
    );

    const selects = screen.getAllByTestId("select");

    fireEvent.change(selects[0], { target: { value: "Janeiro" } });
    fireEvent.change(selects[1], { target: { value: "2025" } });

    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    fireEvent.click(screen.getByText("Confirmar"));

    expect(onConfirmation).toHaveBeenCalledWith({
      month: "Janeiro",
      year: "2025",
      monthNumber: 1,
    });
  });

  it("calls onClose when cancel is clicked", () => {
    render(
      <CashClosingModal
        open={true}
        onConfirmation={onConfirmation}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));

    expect(onClose).toHaveBeenCalled();
  });
});