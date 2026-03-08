import { render, screen } from "@testing-library/react";
import { SummaryRow } from "./summary";

jest.mock("@/utils/utils", () => ({
  formatValueToBRL: jest.fn((value: number) => `R$ ${value}`),
}));

describe("SummaryRow", () => {
  it("renders label and formatted value", () => {
    render(
      <SummaryRow
        label="Receita Líquida"
        value={100}
      />
    );

    expect(screen.getByText("Receita Líquida:")).toBeInTheDocument();
    expect(screen.getByText("R$ 100")).toBeInTheDocument();
  });

  it("applies positive variant", () => {
    const { container } = render(
      <SummaryRow
        label="Diferença"
        value={50}
        variant="positive"
      />
    );

    expect(container.querySelector("span")?.className).toContain("green");
  });

  it("applies negative variant", () => {
    const { container } = render(
      <SummaryRow
        label="Diferença"
        value={-50}
        variant="negative"
      />
    );

    expect(container.querySelector("span")?.className).toContain("red");
  });
});