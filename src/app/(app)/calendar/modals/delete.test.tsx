import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteModal } from "./delete";

/* eslint-disable react/display-name */
jest.mock("@/components/modal/modal", () => {
  const Modal = ({ children }: any) => <div>{children}</div>;

  Modal.Header = ({ children }: any) => <div>{children}</div>;
  Modal.Body = ({ children }: any) => <div>{children}</div>;
  Modal.Footer = ({ children }: any) => <div>{children}</div>;

  return { Modal };
});

jest.mock("@/components/button/button", () => ({
  Button: ({ label, onClick }: any) => (
    <button onClick={onClick}>{label}</button>
  ),
}));

describe("DeleteModal", () => {
  const onClose = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal when mode is view", () => {
    render(
      <DeleteModal
        open
        appointment={{
          mode: "view",
          appointment: { name: "Maria" },
        } as any}
        onClose={onClose}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText("Excluir Agendamento")).toBeInTheDocument();
    expect(screen.getByText(/Maria/)).toBeInTheDocument();
  });

  it("calls onDelete when clicking delete", () => {
    render(
      <DeleteModal
        open
        appointment={{
          mode: "view",
          appointment: { name: "Maria" },
        } as any}
        onClose={onClose}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText("Excluir"));

    expect(onDelete).toHaveBeenCalled();
  });

  it("calls onClose when clicking cancel", () => {
    render(
      <DeleteModal
        open
        appointment={{
          mode: "view",
          appointment: { name: "Maria" },
        } as any}
        onClose={onClose}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));

    expect(onClose).toHaveBeenCalled();
  });

  it("returns null when mode is not view", () => {
    const { container } = render(
      <DeleteModal
        open
        appointment={{
          mode: "create",
          appointment: { name: "Maria" },
        } as any}
        onClose={onClose}
        onDelete={onDelete}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});