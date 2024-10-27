import { render, screen, fireEvent } from "@testing-library/react";
import MonthFilter from "@/app/components/monthFilter";
import "@testing-library/jest-dom";

// Mock of month and years options
jest.mock("@/assets/data", () => ({
  months: ["Janeiro", "Fevereiro", "Março"],
  years: ["2023", "2024", "2025"],
}));

describe("MonthFilter Component", () => {
  const onFilterChangeMock = jest.fn();

  beforeEach(() => {
    render(<MonthFilter month="Janeiro" year="2024" onFilterChange={onFilterChangeMock} />);
  });

  it("renders month and year select elements", () => {
    const monthSelect = screen.getByRole("combobox", { name: "month" });
    expect(monthSelect).toBeInTheDocument();

    const yearSelect = screen.getByRole("combobox", { name: "year" });
    expect(yearSelect).toBeInTheDocument();

    const options = screen.getAllByRole("option");

    expect(options[0]).toHaveTextContent("Mês:");
    expect(options[1]).toHaveTextContent("Janeiro");
    expect(options[2]).toHaveTextContent("Fevereiro");
    expect(options[3]).toHaveTextContent("Março");

    expect(options[4]).toHaveTextContent("Ano:");
    expect(options[5]).toHaveTextContent("2023");
    expect(options[6]).toHaveTextContent("2024");
    expect(options[7]).toHaveTextContent("2025");
  });

  it("calls onFilterChange with the selected month and current year when month is changed", () => {
    const monthSelect = screen.getByRole("combobox", { name: "month" });
    fireEvent.change(monthSelect, { target: { value: "Fevereiro" } });

    expect(onFilterChangeMock).toHaveBeenCalledWith({
      selectedMonth: "Fevereiro",
      selectedYear: "2024",
    });
  });

  it("calls onFilterChange with the current month and selected year when year is changed", () => {
    const yearSelect = screen.getByRole("combobox", { name: "year" });
    fireEvent.change(yearSelect, { target: { value: "2025" } });

    expect(onFilterChangeMock).toHaveBeenCalledWith({
      selectedMonth: "Janeiro",
      selectedYear: "2025",
    });
  });
});
