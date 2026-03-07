import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { ExpenseForm } from "./form";
import { ExpenseFormRef } from "@/types/expense";

describe("ExpenseForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders fields", () => {
    render(<ExpenseForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Data de vencimento")).toBeInTheDocument();
    expect(screen.getByLabelText("Possui parcelas?")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor")).toBeInTheDocument();
    expect(screen.getByLabelText("Observações")).toBeInTheDocument();
  });

  it("shows installments field when checkbox is checked", () => {
    render(<ExpenseForm onSubmit={jest.fn()} />);

    fireEvent.click(screen.getByLabelText("Possui parcelas?"));

    expect(
      screen.getByLabelText("Número de parcelas")
    ).toBeInTheDocument();
  });

  it("fills fields", () => {
    render(<ExpenseForm onSubmit={jest.fn()} />);

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Internet" },
    });

    fireEvent.change(screen.getByLabelText("Data de vencimento"), {
      target: { value: "2025-01-01" },
    });

    fireEvent.change(screen.getByLabelText("Valor"), {
      target: { value: "100" },
    });

    fireEvent.change(screen.getByLabelText("Observações"), {
      target: { value: "Mensal" },
    });

    expect(screen.getByDisplayValue("Internet")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-01-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Mensal")).toBeInTheDocument();
  });

  it("submits the form using ref", async () => {
    const onSubmit = jest.fn();

    const ref = React.createRef<ExpenseFormRef>();

    render(<ExpenseForm ref={ref} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Internet" },
    });

    fireEvent.change(screen.getByLabelText("Data de vencimento"), {
      target: { value: "2025-01-01" },
    });

    fireEvent.change(screen.getByLabelText("Valor"), {
      target: { value: "100" },
    });

    await act(async () => {
      await ref.current?.submit();
    });

    expect(onSubmit).toHaveBeenCalled();
  });

  it("loads default values", () => {
    render(
      <ExpenseForm
        onSubmit={jest.fn()}
        defaultValues={{
          name: "Internet",
          date: "2025-01-01",
          value: 100,
          notes: "Mensal",
          installments: "3",
        } as any}
      />
    );

    expect(screen.getByDisplayValue("Internet")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-01-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Mensal")).toBeInTheDocument();
  });
});