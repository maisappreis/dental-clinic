import { render, screen, fireEvent } from "@testing-library/react";
import { RevenueTable } from "./table";
import { Revenue } from "@/types/revenue";

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, onClick }: any) => (
    <span data-testid={`icon-${icon?.iconName}`} onClick={onClick} />
  ),
}));

jest.mock("@/components/table/table", () => ({
  Table: ({ data, columns, rowKey }: any) => (
    <div>
      {data.map((row: any) => (
        <div key={rowKey(row)} data-testid={`row-${rowKey(row)}`}>
          {columns.map((col: any) => (
            <span key={col.key}>
              {col.render ? col.render(row) : row[col.accessor]}
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/pagination/pagination", () => ({
  Pagination: () => <div />,
}));

jest.mock("@/components/tooltip/tooltip", () => ({
  Tooltip: ({ children }: any) => <span>{children}</span>,
}));

jest.mock("@/hooks/usePagination", () => ({
  usePagination: () => ({
    page: 1,
    setPage: jest.fn(),
  }),
}));

jest.mock("@/utils/date", () => ({
  formatDate: (date: string) => `formatted-${date}`,
}));

jest.mock("@/utils/utils", () => ({
  formatValueToBRL: (value: number) => `R$ ${value}`,
}));

describe("RevenueTable", () => {
  const actions = {
    onOpenUpdate: jest.fn(),
    onOpenDelete: jest.fn(),
  };

  const data: Revenue[] = [
    {
      id: 1,
      name: "Paciente Teste",
      date: "2025-01-01",
      value: 200,
      installments: 1,
      notes: "Observação",
      cpf: "123",
      nf: true,
      procedure: "Limpeza",
      payment: "Dinheiro",
      release_date: "2025-01-01",
      net_value: 200,
    },
  ];

  it("renders table rows", () => {
    render(<RevenueTable data={data} actions={actions} />);

    expect(screen.getByTestId("row-1")).toBeInTheDocument();
    expect(screen.getByText("Paciente Teste")).toBeInTheDocument();
    expect(screen.getByText("R$ 200")).toBeInTheDocument();
  });

  it("calls update action", () => {
    render(<RevenueTable data={data} actions={actions} />);

    fireEvent.click(screen.getByTestId("icon-pen-to-square"));

    expect(actions.onOpenUpdate).toHaveBeenCalledWith(data[0]);
  });

  it("calls delete action", () => {
    render(<RevenueTable data={data} actions={actions} />);

    fireEvent.click(screen.getByTestId("icon-trash-can"));

    expect(actions.onOpenDelete).toHaveBeenCalledWith(data[0]);
  });

  it("toggles notes tooltip", () => {
    render(<RevenueTable data={data} actions={actions} />);

    fireEvent.click(screen.getByTestId("icon-circle-info"));

    expect(screen.getByTestId("icon-circle-info")).toBeInTheDocument();
  });
});