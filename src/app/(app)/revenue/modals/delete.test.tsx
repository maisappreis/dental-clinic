import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteModal } from "./delete";
import { Revenue } from "@/types/revenue";

jest.mock("@/utils/utils", () => ({
  formatValueToBRL: (value: number) => `R$ ${value}`,
}));

describe("DeleteModal", () => {
  const revenue: Revenue = {
    id: 1,
    name: "Paciente Teste",
    date: "2025-01-01",
    value: 150,
    installments: 1,
    notes: "",
    cpf: "",
    nf: false,
    procedure: "Limpeza",
    payment: "Dinheiro",
    release_date: "2025-01-01",
    net_value: 150,
  };

  it("renders modal content when revenue exists", () => {
    render(
      <DeleteModal
        open={true}
        revenue={revenue}
        onClose={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("Excluir Receita")).toBeInTheDocument();
    expect(screen.getByText(/Paciente Teste/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 150/)).toBeInTheDocument();
  });

  it("calls onDelete when clicking delete", () => {
    const onDelete = jest.fn();

    render(
      <DeleteModal
        open={true}
        revenue={revenue}
        onClose={jest.fn()}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText("Excluir"));

    expect(onDelete).toHaveBeenCalled();
  });

  it("calls onClose when clicking cancel", () => {
    const onClose = jest.fn();

    render(
      <DeleteModal
        open={true}
        revenue={revenue}
        onClose={onClose}
        onDelete={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));

    expect(onClose).toHaveBeenCalled();
  });

  it("renders nothing when revenue is undefined", () => {
    const { container } = render(
      <DeleteModal
        open={true}
        revenue={undefined}
        onClose={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});