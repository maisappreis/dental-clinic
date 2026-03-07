import { render, screen, fireEvent } from "@testing-library/react";
import Calendar from "./page";

jest.mock("./Calendar.module.css", () => ({
  grid: "grid",
  addBtn: "addBtn",
  addIcon: "addIcon",
  day: "day",
}));

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>icon</span>,
}));

jest.mock("@/constants/appointment", () => ({
  scheduleOptions: ["09:00", "10:00"],
}));

jest.mock("@/utils/date", () => ({
  getCurrentWeekDays: () => [
    { date: "2025-01-01", dayWeek: "Seg", day: "01" },
    { date: "2025-01-02", dayWeek: "Ter", day: "02" },
  ],
}));

const create = jest.fn();
const update = jest.fn();
const remove = jest.fn();
const fetch = jest.fn();

jest.mock("@/hooks/useAgenda", () => ({
  useAgenda: () => ({
    agenda: [],
    create,
    update,
    remove,
    fetch,
  }),
}));

jest.mock("@/app/(app)/calendar/appointments/appointments", () => ({
  Appointments: ({ time, slots, onOpen }: any) => (
    <div>
      <span>{time}</span>
      {slots.map((slot: any, i: number) => (
        <button key={i} onClick={() => onOpen(slot)}>
          open-slot
        </button>
      ))}
    </div>
  ),
}));

jest.mock("@/app/(app)/calendar/modals/createUpdate", () => ({
  CreateUpdateModal: ({ open }: any) =>
    open ? <div>CreateUpdateModal</div> : null,
}));

jest.mock("@/app/(app)/calendar/modals/delete", () => ({
  DeleteModal: ({ open }: any) => (open ? <div>DeleteModal</div> : null),
}));

jest.mock("@/app/(app)/calendar/modals/readOnly", () => ({
  ReadOnlyModal: ({ open }: any) => (open ? <div>ReadOnlyModal</div> : null),
}));

describe("Calendar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders days of week", () => {
    render(<Calendar />);

    expect(screen.getByText("Seg")).toBeInTheDocument();
    expect(screen.getByText("Ter")).toBeInTheDocument();
  });

  it("calls fetch on mount", () => {
    render(<Calendar />);

    expect(fetch).toHaveBeenCalled();
  });

  it("opens create modal when clicking add button", () => {
    const { container } = render(<Calendar />);

    fireEvent.click(container.querySelector(".addBtn")!);

    expect(screen.getByText("CreateUpdateModal")).toBeInTheDocument();
  });

  it("opens create modal when clicking empty slot", () => {
    render(<Calendar />);

    fireEvent.click(screen.getAllByText("open-slot")[0]);

    expect(screen.getByText("CreateUpdateModal")).toBeInTheDocument();
  });

  it("renders schedule rows", () => {
    render(<Calendar />);

    expect(screen.getByText("09:00")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });
});