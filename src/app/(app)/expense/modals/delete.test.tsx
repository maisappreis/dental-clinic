import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteModal } from "./delete";
import { Expense } from "@/types/expense";

jest.mock("@/utils/utils", () => ({
  formatValueToBRL: (value: number) => `R$ ${value}`,
}));

const expense: Expense = {
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

describe("DeleteModal", () => {
  it("renders modal content", () => {
    render(
      <DeleteModal
        open
        expense={expense}
        onClose={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("Excluir Despesa")).toBeInTheDocument();
    expect(screen.getByText("Internet")).toBeInTheDocument();
    expect(screen.getByText("R$ 100")).toBeInTheDocument();
  });

  it("calls onDelete when delete clicked", () => {
    const onDelete = jest.fn();

    render(
      <DeleteModal
        open
        expense={expense}
        onClose={jest.fn()}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText("Excluir"));

    expect(onDelete).toHaveBeenCalled();
  });

  it("calls onClose when cancel clicked", () => {
    const onClose = jest.fn();

    render(
      <DeleteModal
        open
        expense={expense}
        onClose={onClose}
        onDelete={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));

    expect(onClose).toHaveBeenCalled();
  });

  it("returns null when expense not provided", () => {
    const { container } = render(
      <DeleteModal
        open
        onClose={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});