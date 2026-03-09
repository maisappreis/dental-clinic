import { render, screen } from "@testing-library/react";
import { Table, Column } from "@/components/table/table";

interface User {
  id: number;
  name: string;
  age: number;
}

const columns: Column<User>[] = [
  { key: "name", header: "Name", accessor: "name" },
  { key: "age", header: "Age", accessor: "age", align: "right" },
];

const data: User[] = [
  { id: 1, name: "John", age: 30 },
  { id: 2, name: "Jane", age: 25 },
];

describe("Table Component", () => {
  it("renders table headers", () => {
    render(
      <Table
        data={data}
        columns={columns}
        rowKey={(row) => row.id}
      />
    );

    expect(screen.getByText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Age/i)).toBeInTheDocument();
  });

  it("renders table rows", () => {
    render(
      <Table
        data={data}
        columns={columns}
        rowKey={(row) => row.id}
      />
    );

    expect(screen.getByText(/John/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane/i)).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("renders empty message when no data", () => {
    render(
      <Table
        data={[]}
        columns={columns}
        rowKey={(row) => row.id}
      />
    );

    expect(
      screen.getByText(/Nenhum resultado encontrado/i)
    ).toBeInTheDocument();
  });

  it("renders custom empty message", () => {
    render(
      <Table
        data={[]}
        columns={columns}
        rowKey={(row) => row.id}
        emptyMessage="No records"
      />
    );

    expect(screen.getByText(/No records/i)).toBeInTheDocument();
  });

  it("renders custom cell using render function", () => {
    const customColumns: Column<User>[] = [
      {
        key: "custom",
        header: "Custom",
        render: (row) => `User: ${row.name}`,
      },
    ];

    render(
      <Table
        data={data}
        columns={customColumns}
        rowKey={(row) => row.id}
      />
    );

    expect(screen.getByText(/User: John/i)).toBeInTheDocument();
    expect(screen.getByText(/User: Jane/i)).toBeInTheDocument();
  });
});