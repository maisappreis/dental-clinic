import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ExpensePage from "./page";
import { Expense } from "@/types/expense";

jest.mock("@/app/(app)/expense/table/table", () => ({
  ExpenseTable: ({ actions }: any) => (
    <div>
      <button onClick={() => actions.onConfirmStatus(mockExpense)}>status</button>
      <button onClick={() => actions.onOpenUpdate(mockExpense)}>edit</button>
      <button onClick={() => actions.onOpenDelete(mockExpense)}>delete</button>
    </div>
  ),
}));

jest.mock("@/components/search/search", () => ({
  Search: ({ onValueChange }: any) => (
    <input
      aria-label="search"
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),
}));

jest.mock("@/components/filter/filter", () => ({
  Filter: ({ onChange }: any) => (
    <button onClick={() => onChange("changed")}>filter</button>
  ),
}));

jest.mock("./modals/createUpdate", () => ({
  CreateUpdateModal: ({ open }: any) =>
    open ? <div>CreateUpdateModal</div> : null,
}));

jest.mock("./modals/delete", () => ({
  DeleteModal: ({ open }: any) =>
    open ? <div>DeleteModal</div> : null,
}));

jest.mock("./modals/paymentStatus", () => ({
  PaymentStatusModal: ({ open }: any) =>
    open ? <div>PaymentStatusModal</div> : null,
}));

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockRemove = jest.fn();
const mockFetch = jest.fn();

jest.mock("@/hooks/useExpense", () => ({
  useExpense: () => ({
    expenses: [mockExpense],
    create: mockCreate,
    update: mockUpdate,
    remove: mockRemove,
    fetchExpenses: mockFetch,
  }),
}));

const mockExpense: Expense = {
  id: 1,
  name: "Internet",
  date: "2025-03-10",
  value: 100,
  installments: "",
  notes: "Conta",
  year: 2025,
  month: "Março",
  is_paid: false,
};

describe("ExpensePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders page", () => {
    render(<ExpensePage />);

    expect(screen.getByText("Nova Despesa")).toBeInTheDocument();
  });

  it("calls fetchExpenses on mount", () => {
    render(<ExpensePage />);

    expect(mockFetch).toHaveBeenCalled();
  });

  it("opens create modal", () => {
    render(<ExpensePage />);

    fireEvent.click(screen.getByText("Nova Despesa"));

    expect(screen.getByText("CreateUpdateModal")).toBeInTheDocument();
  });

  it("opens update modal", () => {
    render(<ExpensePage />);

    fireEvent.click(screen.getByText("edit"));

    expect(screen.getByText("CreateUpdateModal")).toBeInTheDocument();
  });

  it("opens delete modal", () => {
    render(<ExpensePage />);

    fireEvent.click(screen.getByText("delete"));

    expect(screen.getByText("DeleteModal")).toBeInTheDocument();
  });

  it("opens payment status modal", () => {
    render(<ExpensePage />);

    fireEvent.click(screen.getByText("status"));

    expect(screen.getByText("PaymentStatusModal")).toBeInTheDocument();
  });

  it("updates search", () => {
    render(<ExpensePage />);

    fireEvent.change(screen.getByLabelText("search"), {
      target: { value: "internet" },
    });
  });

  it("changes filter", () => {
    render(<ExpensePage />);

    const filters = screen.getAllByText("filter");

    fireEvent.click(filters[0]);
    fireEvent.click(filters[1]);
    fireEvent.click(filters[2]);
  });

  it("deletes expense", async () => {
    render(<ExpensePage />);

    fireEvent.click(screen.getByText("delete"));

    await waitFor(() => {
      expect(screen.getByText("DeleteModal")).toBeInTheDocument();
    });
  });
});