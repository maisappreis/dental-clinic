import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateUpdateModal } from "./createUpdate";
import { Revenue } from "@/types/revenue";

/* eslint-disable react/display-name */
jest.mock("@/app/(app)/revenue/form/form", () => {
  const React = require("react");
  return {
    RevenueForm: React.forwardRef(({ onSubmit }: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        submit: () =>
          onSubmit({
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
          }),
      }));
      return <div>RevenueForm</div>;
    }),
  };
});

describe("CreateUpdateModal", () => {
  it("calls onCreate when saving without revenue", async () => {
    const onCreate = jest.fn().mockResolvedValue(undefined);
    const onUpdate = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    render(
      <CreateUpdateModal
        open={true}
        onClose={onClose}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    );

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalled();
    });

    expect(onUpdate).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onUpdate when revenue exists", async () => {
    const onCreate = jest.fn().mockResolvedValue(undefined);
    const onUpdate = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    const revenue: Revenue = {
      id: 1,
      name: "Paciente",
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
    };

    render(
      <CreateUpdateModal
        open={true}
        revenue={revenue}
        onClose={onClose}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    );

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });

    expect(onCreate).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when clicking cancel", () => {
    const onCreate = jest.fn();
    const onUpdate = jest.fn();
    const onClose = jest.fn();

    render(
      <CreateUpdateModal
        open={true}
        onClose={onClose}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));

    expect(onClose).toHaveBeenCalled();
  });
});