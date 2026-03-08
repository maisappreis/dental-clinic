import { render, screen, fireEvent } from "@testing-library/react";
import { RateInput } from "./input";

describe("RateInput", () => {
  it("renders label and input", () => {
    render(
      <RateInput
        id="debit"
        label="Débito (%)"
        value={1}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByLabelText("Débito (%)")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  });

  it("calls onChange when value changes", () => {
    const onChange = jest.fn();

    render(
      <RateInput
        id="cashCredit"
        label="Crédito à vista (%)"
        value={2}
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Crédito à vista (%)"), {
      target: { value: "5" },
    });

    expect(onChange).toHaveBeenCalled();
  });

  it("has correct input attributes", () => {
    render(
      <RateInput
        id="installmentCredit"
        label="Crédito à prazo (%)"
        value={3}
        onChange={jest.fn()}
      />
    );

    const input = screen.getByLabelText("Crédito à prazo (%)");

    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("step", "0.001");
  });
});