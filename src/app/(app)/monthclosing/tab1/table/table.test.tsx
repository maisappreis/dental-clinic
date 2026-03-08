import { render, screen, fireEvent } from "@testing-library/react";
import { TabOneTable } from "./table";

jest.mock("@/components/table/table", () => ({
  Table: ({ data, columns, rowKey }: any) => (
    <div>
      {data.map((row: any, index: number) => (
        <div key={rowKey(row)} data-testid={`row-${row.id}`}>
          {columns.map((col: any) => (
            <span key={col.key}>
              {col.render
                ? col.render(row, index)
                : row[col.accessor]}
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/utils/date", () => ({
  formatDate: (d: string) => `formatted-${d}`,
}));

jest.mock("@/utils/utils", () => ({
  formatValueToBRL: (v: number) => `R$ ${v}`,
}));

describe("TabOneTable", () => {
  const onInputChange = jest.fn();

  const data = [
    {
      id: 1,
      date: "2025-01-01",
      release_date: "2025-01-02",
      name: "Paciente Teste",
      payment: "Débito",
      installments: 1,
      value: 100,
      net_value: 95,
    },
  ];

  it("renders table rows", () => {
    render(
      <TabOneTable
        data={data as any}
        actions={{ onInputChange }}
      />
    );

    expect(screen.getByTestId("row-1")).toBeInTheDocument();
    expect(screen.getByText("Paciente Teste")).toBeInTheDocument();
    expect(screen.getByText("R$ 100")).toBeInTheDocument();
  });

  it("renders net value input", () => {
    render(
      <TabOneTable
        data={data as any}
        actions={{ onInputChange }}
      />
    );

    const input = screen.getByDisplayValue("95");
    expect(input).toBeInTheDocument();
  });

  it("calls onInputChange when net value changes", () => {
    render(
      <TabOneTable
        data={data as any}
        actions={{ onInputChange }}
      />
    );

    const input = screen.getByDisplayValue("95");

    fireEvent.change(input, {
      target: { value: "90" },
    });

    expect(onInputChange).toHaveBeenCalled();
  });

  it("highlights payment when credit/debit", () => {
    render(
      <TabOneTable
        data={data as any}
        actions={{ onInputChange }}
      />
    );

    const payment = screen.getByText("Débito");
    expect(payment).toHaveStyle({
      color: "red",
      fontWeight: "bold",
    });
  });
});