import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentStatusModal } from "./paymentStatus";
import { Expense } from "@/types/expense";

const baseExpense: Expense = {
  id: 1,
  name: "Internet",
  date: "2025-03-10",
  value: 100,
  installments: "1/1",
  notes: "Conta mensal",
  year: 2025,
  month: "Março",
  is_paid: false,
};

describe("PaymentStatusModal", () => {
  it("renders modal to mark as pago when expense is not paid", () => {
    render(
      <PaymentStatusModal
        open
        expense={{ ...baseExpense, is_paid: false }}
        onClose={jest.fn()}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText("Marcar como pago")).toBeInTheDocument();
    expect(
      screen.getByText(/Gostaria de marcar essa despesa como/i)
    ).toBeInTheDocument();
  });

  it("renders modal to mark as à pagar when expense is paid", () => {
    render(
      <PaymentStatusModal
        open
        expense={{ ...baseExpense, is_paid: true }}
        onClose={jest.fn()}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText("Marcar como à pagar")).toBeInTheDocument();
  });

  it("calls onChange when confirm clicked", () => {
    const onChange = jest.fn();

    render(
      <PaymentStatusModal
        open
        expense={baseExpense}
        onClose={jest.fn()}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByText("Confirmar"));

    expect(onChange).toHaveBeenCalled();
  });

  it("calls onClose when cancel clicked", () => {
    const onClose = jest.fn();

    render(
      <PaymentStatusModal
        open
        expense={baseExpense}
        onClose={onClose}
        onChange={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));

    expect(onClose).toHaveBeenCalled();
  });

  it("returns null when expense not provided", () => {
    const { container } = render(
      <PaymentStatusModal
        open
        onClose={jest.fn()}
        onChange={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});