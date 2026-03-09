import { render, screen, fireEvent } from "@testing-library/react";
import { RatesForm } from "./form";

jest.mock("@/app/(app)/monthclosing/tab1/input/input", () => ({
  RateInput: ({ id, label, value, onChange }: any) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} value={value} onChange={onChange} />
    </div>
  ),
}));

describe("RatesForm", () => {
  const baseValue = {
    debit: 1,
    cashCredit: 2,
    installmentCredit: 3,
  };

  it("renders all inputs", () => {
    render(<RatesForm value={baseValue} onChange={jest.fn()} />);

    expect(screen.getByLabelText("Débito (%)")).toBeInTheDocument();
    expect(screen.getByLabelText("Crédito à vista (%)")).toBeInTheDocument();
    expect(screen.getByLabelText("Crédito à prazo (%)")).toBeInTheDocument();
  });

  it("calls onChange when debit changes", () => {
    const onChange = jest.fn();

    render(<RatesForm value={baseValue} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Débito (%)"), {
      target: { name: "debit", value: "5" },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...baseValue,
      debit: 5,
    });
  });

  it("converts empty value to 0", () => {
    const onChange = jest.fn();

    render(<RatesForm value={baseValue} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Crédito à vista (%)"), {
      target: { name: "cashCredit", value: "" },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...baseValue,
      cashCredit: 0,
    });
  });

  it("updates installment credit", () => {
    const onChange = jest.fn();

    render(<RatesForm value={baseValue} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Crédito à prazo (%)"), {
      target: { name: "installmentCredit", value: "7" },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...baseValue,
      installmentCredit: 7,
    });
  });
});