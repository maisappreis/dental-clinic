import { render, screen, fireEvent } from "@testing-library/react";
import { ReadOnlyModal } from "./readOnly";

jest.mock("@/utils/date", () => ({
  formatDate: (date: string) => `formatted-${date}`,
}));

describe("ReadOnlyModal", () => {
  const appointment = {
    id: 1,
    name: "Maria",
    date: "2025-01-01",
    time: "10:00",
    notes: "Consulta",
  };

  const onClose = jest.fn();
  const onUpdate = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders appointment data", () => {
    render(
      <ReadOnlyModal
        open
        appointment={{ mode: "view", appointment } as any}
        onClose={onClose}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText("Agendamento")).toBeInTheDocument();
    expect(screen.getByText(/Maria/)).toBeInTheDocument();
    expect(screen.getByText(/formatted-2025-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/10:00/)).toBeInTheDocument();
    expect(screen.getByText(/Consulta/)).toBeInTheDocument();
  });

  it("calls onUpdate", () => {
    render(
      <ReadOnlyModal
        open
        appointment={{ mode: "view", appointment } as any}
        onClose={onClose}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText("Editar"));

    expect(onUpdate).toHaveBeenCalledWith(appointment);
  });

  it("calls onDelete", () => {
    render(
      <ReadOnlyModal
        open
        appointment={{ mode: "view", appointment } as any}
        onClose={onClose}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText("Excluir"));

    expect(onDelete).toHaveBeenCalledWith(appointment);
  });

  it("calls onClose", () => {
    render(
      <ReadOnlyModal
        open
        appointment={{ mode: "view", appointment } as any}
        onClose={onClose}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));

    expect(onClose).toHaveBeenCalled();
  });

  it("returns null when mode is not view", () => {
    const { container } = render(
      <ReadOnlyModal
        open
        appointment={{ mode: "create", appointment } as any}
        onClose={onClose}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});