import { render, screen, fireEvent } from "@testing-library/react";
import { ExpenseTable } from "./table";
import { Expense } from "@/types/expense";

jest.mock("@/components/pagination/pagination", () => ({
  Pagination: ({ onPageChange }: any) => (
    <button onClick={() => onPageChange(2)}>next-page</button>
  ),
}));

const expense: Expense = {
  id: 1,
  year: 2025,
  month: "Março",
  name: "Internet",
  installments: "1/1",
  date: "2025-03-10",
  value: 100,
  is_paid: false,
  notes: "Conta mensal",
};

describe("ExpenseTable", () => {
  it("renders expense data", () => {
    render(
      <ExpenseTable
        data={[expense]}
        actions={{
          onConfirmStatus: jest.fn(),
          onOpenUpdate: jest.fn(),
          onOpenDelete: jest.fn(),
        }}
      />
    );

    expect(screen.getByText("Internet")).toBeInTheDocument();
  });

  it("calls confirm status action", () => {
    const onConfirmStatus = jest.fn();

    render(
      <ExpenseTable
        data={[expense]}
        actions={{
          onConfirmStatus,
          onOpenUpdate: jest.fn(),
          onOpenDelete: jest.fn(),
        }}
      />
    );

    fireEvent.click(screen.getByText("À pagar"));

    expect(onConfirmStatus).toHaveBeenCalledWith(expense);
  });

  it("calls update action", () => {
    const onOpenUpdate = jest.fn();

    render(
      <ExpenseTable
        data={[expense]}
        actions={{
          onConfirmStatus: jest.fn(),
          onOpenUpdate,
          onOpenDelete: jest.fn(),
        }}
      />
    );

    const icons = document.querySelectorAll(".table-icon");

    fireEvent.click(icons[1]);

    expect(onOpenUpdate).toHaveBeenCalledWith(expense);
  });

  it("calls delete action", () => {
    const onOpenDelete = jest.fn();

    render(
      <ExpenseTable
        data={[expense]}
        actions={{
          onConfirmStatus: jest.fn(),
          onOpenUpdate: jest.fn(),
          onOpenDelete,
        }}
      />
    );

    const icons = document.querySelectorAll(".table-icon");

    fireEvent.click(icons[2]);

    expect(onOpenDelete).toHaveBeenCalledWith(expense);
  });

  it("changes page", () => {
    render(
      <ExpenseTable
        data={Array.from({ length: 40 }, (_, i) => ({
          ...expense,
          id: i,
        }))}
        actions={{
          onConfirmStatus: jest.fn(),
          onOpenUpdate: jest.fn(),
          onOpenDelete: jest.fn(),
        }}
      />
    );

    fireEvent.click(screen.getByText("next-page"));
  });
});