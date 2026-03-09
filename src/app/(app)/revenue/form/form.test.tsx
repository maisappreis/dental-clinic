import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { RevenueForm } from "./form";
import { RevenueFormRef } from "@/types/revenue";

jest.mock("@/constants/procedures", () => ({
  procedureOptions: ["Limpeza", "Extração"],
}));

jest.mock("@/constants/payment", () => ({
  paymentOptions: ["Pix", "Crédito à vista", "Crédito à prazo"],
  installmentOptions: [1, 2, 3],
}));

jest.mock("@/utils/date", () => ({
  getCurrentDate: () => "2025-01-01",
}));

jest.mock("@/utils/utils", () => ({
  formatCPF: (v: string) => v,
}));

describe("RevenueForm", () => {
  it("renders basic fields", () => {
    render(<RevenueForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Data")).toBeInTheDocument();
    expect(screen.getByLabelText("Procedimento")).toBeInTheDocument();
    expect(screen.getByLabelText("Forma de pagamento")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor")).toBeInTheDocument();
    expect(screen.getByLabelText("Observações")).toBeInTheDocument();
  });

  it("shows CPF field when invoice checkbox checked", () => {
    render(<RevenueForm onSubmit={jest.fn()} />);

    fireEvent.click(screen.getByLabelText("Com nota fiscal?"));

    expect(screen.getByLabelText("CPF")).toBeInTheDocument();
  });

  it("shows installments when payment is Crédito à prazo", () => {
    render(<RevenueForm onSubmit={jest.fn()} />);

    fireEvent.change(screen.getByLabelText("Forma de pagamento"), {
      target: { value: "Crédito à prazo" },
    });

    expect(
      screen.getByLabelText("Número de parcelas")
    ).toBeInTheDocument();
  });

  it("submits form via ref", async () => {
    const onSubmit = jest.fn();
    const ref = React.createRef<RevenueFormRef>();

    render(<RevenueForm ref={ref} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Maria" },
    });

    fireEvent.change(screen.getByLabelText("Data"), {
      target: { value: "2025-01-01" },
    });

    fireEvent.change(screen.getByLabelText("Procedimento"), {
      target: { value: "Limpeza" },
    });

    fireEvent.change(screen.getByLabelText("Forma de pagamento"), {
      target: { value: "Pix" },
    });

    fireEvent.change(screen.getByLabelText("Valor"), {
      target: { value: "100" },
    });

    await act(async () => {
      await ref.current?.submit();
    });

    expect(onSubmit).toHaveBeenCalled();
  });
});