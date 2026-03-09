import { render, screen, fireEvent } from "@testing-library/react";
import RevenuePage from "./page";

jest.mock("@/components/button/button", () => ({
  Button: ({ label, onClick }: any) => (
    <button onClick={onClick}>{label}</button>
  ),
}));

jest.mock("@/components/search/search", () => ({
  Search: ({ value, onValueChange }: any) => (
    <input
      data-testid="search"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),
}));

jest.mock("@/components/filter/filter", () => ({
  Filter: ({ value, onChange }: any) => (
    <select
      data-testid="filter"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value={value}>{value}</option>
    </select>
  ),
}));

jest.mock("@/app/(app)/revenue/table/table", () => ({
  RevenueTable: ({ data, actions }: any) => (
    <div>
      {data.map((item: any) => (
        <div key={item.id}>
          <span>{item.name}</span>
          <button onClick={() => actions.onOpenUpdate(item)}>edit</button>
          <button onClick={() => actions.onOpenDelete(item)}>delete</button>
        </div>
      ))}
    </div>
  ),
}));

jest.mock("./modals/createUpdate", () => ({
  CreateUpdateModal: ({ open }: any) =>
    open ? <div data-testid="create-update-modal" /> : null,
}));

jest.mock("./modals/delete", () => ({
  DeleteModal: ({ open }: any) =>
    open ? <div data-testid="delete-modal" /> : null,
}));

const mockFetch = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockRemove = jest.fn();

jest.mock("@/hooks/useRevenue", () => ({
  useRevenue: () => ({
    revenue: [
      {
        id: 1,
        name: "Paciente Teste",
        date: "2025-01-01",
        value: 100,
        installments: 1,
        notes: "",
        cpf: "",
        nf: false,
        procedure: "Limpeza",
        payment: "Dinheiro",
        release_date: "2025-01-01",
        net_value: 100,
      },
    ],
    create: mockCreate,
    update: mockUpdate,
    remove: mockRemove,
    fetchRevenue: mockFetch,
  }),
}));

jest.mock("@/utils/date", () => ({
  getCurrentYear: () => 2025,
  getCurrentMonth: () => "Janeiro",
}));

jest.mock("@/utils/search", () => ({
  applySearch: (data: any) => data,
}));

jest.mock("@/utils/filter", () => ({
  filterRevenueByMonthAndYear: (data: any) => data,
}));

jest.mock("@/constants/date", () => ({
  months: ["Janeiro"],
  years: [2025],
}));

describe("RevenuePage", () => {
  it("renders revenue data", () => {
    render(<RevenuePage />);

    expect(screen.getByText("Paciente Teste")).toBeInTheDocument();
  });

  it("calls fetchRevenue on mount", () => {
    render(<RevenuePage />);

    expect(mockFetch).toHaveBeenCalled();
  });

  it("opens create modal", () => {
    render(<RevenuePage />);

    fireEvent.click(screen.getByText("Nova Receita"));

    expect(screen.getByTestId("create-update-modal")).toBeInTheDocument();
  });

  it("opens update modal", () => {
    render(<RevenuePage />);

    fireEvent.click(screen.getByText("edit"));

    expect(screen.getByTestId("create-update-modal")).toBeInTheDocument();
  });

  it("opens delete modal", () => {
    render(<RevenuePage />);

    fireEvent.click(screen.getByText("delete"));

    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
  });

  it("updates search value", () => {
    render(<RevenuePage />);

    const search = screen.getByTestId("search");

    fireEvent.change(search, { target: { value: "teste" } });

    expect((search as HTMLInputElement).value).toBe("teste");
  });

  it("changes filter values", () => {
    render(<RevenuePage />);

    const filters = screen.getAllByTestId("filter");

    fireEvent.change(filters[0], { target: { value: "Janeiro" } });

    expect(filters[0]).toBeInTheDocument();
  });
});