import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { AppointmentForm } from "./form";

jest.mock("@/constants/appointment", () => ({
  scheduleOptions: ["09:00", "10:00"],
}));

describe("AppointmentForm", () => {
  it("renders fields", () => {
    render(<AppointmentForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText("Paciente")).toBeInTheDocument();
    expect(screen.getByLabelText("Data")).toBeInTheDocument();
    expect(screen.getByLabelText("Horário")).toBeInTheDocument();
    expect(screen.getByLabelText("Observações")).toBeInTheDocument();
  });

  it("fills fields", () => {
    render(<AppointmentForm onSubmit={jest.fn()} />);

    fireEvent.change(screen.getByLabelText("Paciente"), {
      target: { value: "Maria" },
    });

    fireEvent.change(screen.getByLabelText("Data"), {
      target: { value: "2025-01-01" },
    });

    fireEvent.change(screen.getByLabelText("Horário"), {
      target: { value: "09:00" },
    });

    fireEvent.change(screen.getByLabelText("Observações"), {
      target: { value: "Consulta" },
    });

    expect(screen.getByDisplayValue("Maria")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-01-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("09:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Consulta")).toBeInTheDocument();
  });

  it("submits using ref", async () => {
    const onSubmit = jest.fn();
    const ref = React.createRef<any>();

    render(<AppointmentForm ref={ref} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Paciente"), {
      target: { value: "Maria" },
    });

    fireEvent.change(screen.getByLabelText("Data"), {
      target: { value: "2025-01-01" },
    });

    fireEvent.change(screen.getByLabelText("Horário"), {
      target: { value: "09:00" },
    });

    fireEvent.change(screen.getByLabelText("Observações"), {
      target: { value: "Consulta" },
    });

    await act(async () => {
      await ref.current.submit();
    });

    expect(onSubmit).toHaveBeenCalled();
  });

  it("loads default values", () => {
    render(
      <AppointmentForm
        onSubmit={jest.fn()}
        defaultValues={{
          name: "João",
          date: "2025-02-01",
          time: "10:00",
          notes: "Retorno",
        }}
      />
    );

    expect(screen.getByDisplayValue("João")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-02-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Retorno")).toBeInTheDocument();
  });
});