import { render, screen, fireEvent } from "@testing-library/react";
import { CreateUpdateModal } from "@/app/(app)/calendar/modals/createUpdate";

const submitMock = jest.fn();

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

jest.mock("@/app/(app)/calendar/form/form", () => {
  const React = require("react");

  const AppointmentForm = React.forwardRef(({ onSubmit }: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      submit: () =>
        onSubmit({
          name: "Teste",
          date: "2025-01-01",
          time: "10:00",
          notes: "Obs",
        }),
    }));

    return <div>Form</div>;
  });

  AppointmentForm.displayName = "AppointmentForm";

  return { AppointmentForm };
});

describe("CreateUpdateModal", () => {
  const onCreate = jest.fn().mockResolvedValue(undefined);
  const onUpdate = jest.fn().mockResolvedValue(undefined);
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders create mode", () => {
    render(
      <CreateUpdateModal
        open
        appointment={{
          mode: "create",
          draft: {
            name: "",
            date: "",
            time: "",
            notes: "",
          },
        }}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onClose={onClose}
      />
    );

    expect(screen.getByText("Adicionar Agendamento")).toBeInTheDocument();
  });

  it("renders update mode", () => {
    render(
      <CreateUpdateModal
        open
        appointment={{
          mode: "update",
          draft: {
            id: 1,
            name: "Teste",
            date: "13/12/1889",
            time: "19:00",
            notes: "notes"
          },
        }}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onClose={onClose}
      />
    );

    expect(screen.getByText("Editar Agendamento")).toBeInTheDocument();
  });

  it("calls onCreate when submitting in create mode", async () => {
    render(
      <CreateUpdateModal
        open
        appointment={{
          mode: "create",
          draft: {
            name: "Teste",
            date: "13/12/1889",
            time: "19:00",
            notes: "notes"
          },
        }}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("Salvar"));

    expect(onCreate).toHaveBeenCalled();
  });

  it("calls onUpdate when submitting in update mode", async () => {
    render(
      <CreateUpdateModal
        open
        appointment={{
          mode: "update",
          draft: {
            id: 1,
            name: "Teste",
            date: "13/12/1889",
            time: "19:00",
            notes: "notes"
          },
        }}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("Salvar"));

    expect(onUpdate).toHaveBeenCalled();
  });

  it("calls onClose when cancel button clicked", () => {
    render(
      <CreateUpdateModal
        open
        appointment={{
          mode: "create",
          draft: {
            name: "Teste",
            date: "13/12/1889",
            time: "19:00",
            notes: "notes"},
        }}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));

    expect(onClose).toHaveBeenCalled();
  });

  it("returns null when mode is not create or update", () => {
    const { container } = render(
      <CreateUpdateModal
        open
        appointment={{
          mode: "view",
          draft: {},
        } as any}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onClose={onClose}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});