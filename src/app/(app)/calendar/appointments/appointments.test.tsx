import { render, screen, fireEvent } from "@testing-library/react";
import { Appointments } from "./appointments";

jest.mock("./Calendar.module.css", () => ({
  time: "time",
  appointment: "appointment",
  text: "text",
}));

describe("Appointments", () => {
  const onOpen = jest.fn();

  const slots = [
    { appointment: { name: "Maria" } },
    { appointment: { name: "João da Silva Muito Longo" } },
    { appointment: null },
  ] as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders time", () => {
    render(<Appointments time="10:00" slots={slots} onOpen={onOpen} />);

    expect(screen.getByText("10:00")).toBeInTheDocument();
  });

  it("renders appointment names", () => {
    render(<Appointments time="10:00" slots={slots} onOpen={onOpen} />);

    expect(screen.getByText("Maria")).toBeInTheDocument();
  });

  it("shortens long names", () => {
    render(<Appointments time="10:00" slots={slots} onOpen={onOpen} />);

    expect(screen.getByText("João da S..")).toBeInTheDocument();
  });

  it("calls onOpen when clicking appointment", () => {
    render(<Appointments time="10:00" slots={slots} onOpen={onOpen} />);

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[0]);

    expect(onOpen).toHaveBeenCalledWith(slots[0]);
  });

  it("renders empty when slot has no appointment", () => {
    render(<Appointments time="10:00" slots={slots} onOpen={onOpen} />);

    const buttons = screen.getAllByRole("button");

    expect(buttons[2]).toBeInTheDocument();
  });
});