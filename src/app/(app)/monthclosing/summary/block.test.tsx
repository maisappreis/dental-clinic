import { render, screen } from "@testing-library/react";
import { SummaryBlock } from "./block";

jest.mock("@/utils/utils", () => ({
  formatValueToBRL: (value: number) => `R$ ${value}`,
}));

describe("SummaryBlock", () => {
  it("renders title and items", () => {
    render(
      <SummaryBlock
        title="Receitas"
        items={[
          { label: "Dinheiro", value: 100 },
          { label: "Cartão", value: 200 },
        ]}
      />
    );

    expect(screen.getByText("Receitas")).toBeInTheDocument();
    expect(screen.getByText("Dinheiro")).toBeInTheDocument();
    expect(screen.getByText("Cartão")).toBeInTheDocument();
    expect(screen.getByText("R$ 100")).toBeInTheDocument();
    expect(screen.getByText("R$ 200")).toBeInTheDocument();
  });

  it("renders total when provided", () => {
    render(
      <SummaryBlock
        title="Resumo"
        items={[{ label: "Item", value: 50 }]}
        total={150}
      />
    );

    expect(screen.getByText("Total:")).toBeInTheDocument();
    expect(screen.getByText("R$ 150")).toBeInTheDocument();
  });

  it("does not render total when not provided", () => {
    render(
      <SummaryBlock
        title="Resumo"
        items={[{ label: "Item", value: 50 }]}
      />
    );

    expect(screen.queryByText("Total:")).not.toBeInTheDocument();
  });
});