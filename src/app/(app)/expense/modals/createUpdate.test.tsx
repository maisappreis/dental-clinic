import { render, screen, fireEvent } from "@testing-library/react";
import { CreateUpdateModal } from "./createUpdate";
import { Expense } from "@/types/expense";

let capturedOnSubmit: any;

jest.mock("@/app/(app)/expense/form/form", () => {
  const React = require("react");

  const ExpenseForm = React.forwardRef(({ onSubmit }: any, ref: any) => {
    capturedOnSubmit = onSubmit;

    React.useImperativeHandle(ref, () => ({
      submit: jest.fn(),
    }));

    return <div>ExpenseForm</div>;
  });

  ExpenseForm.displayName = "ExpenseForm";

  return { ExpenseForm };
});

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

describe("CreateUpdateModal", () => {
  it("renders create mode", () => {
    render(
      <CreateUpdateModal
        open
        onClose={jest.fn()}
        onCreate={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText("Adicionar Despesa")).toBeInTheDocument();
  });

  it("renders edit mode", () => {
    render(
      <CreateUpdateModal
        open
        expense={expense}
        onClose={jest.fn()}
        onCreate={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText("Editar Despesa")).toBeInTheDocument();
  });

  it("calls onCreate on submit", async () => {
    const onCreate = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    render(
      <CreateUpdateModal
        open
        onClose={onClose}
        onCreate={onCreate}
        onUpdate={jest.fn()}
      />
    );

    await capturedOnSubmit({
      name: "Internet",
      date: "2025-03-10",
      value: 100,
      installments: "1/1",
      hasInstallments: true,
      notes: "Conta mensal",
    });

    expect(onCreate).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onUpdate on submit", async () => {
    const onUpdate = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    render(
      <CreateUpdateModal
        open
        expense={expense}
        onClose={onClose}
        onCreate={jest.fn()}
        onUpdate={onUpdate}
      />
    );

    await capturedOnSubmit({
      name: "Internet",
      date: "2025-03-10",
      value: 100,
      installments: "1/1",
      hasInstallments: true,
      notes: "Conta mensal",
    });

    expect(onUpdate).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when cancel clicked", () => {
    const onClose = jest.fn();

    render(
      <CreateUpdateModal
        open
        onClose={onClose}
        onCreate={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));

    expect(onClose).toHaveBeenCalled();
  });
});