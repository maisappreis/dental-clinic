import {
  filterRevenueByMonthAndYear,
  filterExpenseByMonthYearStatus,
  filterRevenue,
} from "./filter";

import { Revenue } from "@/types/revenue";
import { Expense } from "@/types/expense";

jest.mock("@/utils/date", () => ({
  getMonthAndYear: (date: string) => {
    const [year, month] = date.split("-");
    const months: Record<string, string> = {
      "01": "Janeiro",
      "02": "Fevereiro",
      "03": "Março",
    };
    return [months[month], year];
  },
}));

describe("filterRevenueByMonthAndYear", () => {
  const revenue = [
    { date: "2025-01-10" },
    { date: "2025-02-10" },
    { date: "2024-01-10" },
  ] as Revenue[];

  it("returns all when month and year are Todos", () => {
    const result = filterRevenueByMonthAndYear(revenue, {
      month: "Todos",
      year: "Todos",
    });

    expect(result).toHaveLength(3);
  });

  it("filters by year only", () => {
    const result = filterRevenueByMonthAndYear(revenue, {
      month: "Todos",
      year: "2025",
    });

    expect(result).toHaveLength(2);
  });

  it("filters by month only", () => {
    const result = filterRevenueByMonthAndYear(revenue, {
      month: "Janeiro",
      year: "Todos",
    });

    expect(result).toHaveLength(2);
  });

  it("filters by month and year", () => {
    const result = filterRevenueByMonthAndYear(revenue, {
      month: "Janeiro",
      year: "2025",
    });

    expect(result).toHaveLength(1);
    expect(result[0].date).toBe("2025-01-10");
  });

  it("returns empty array if revenue empty", () => {
    const result = filterRevenueByMonthAndYear([], {
      month: "Janeiro",
      year: "2025",
    });

    expect(result).toEqual([]);
  });
});

describe("filterExpenseByMonthYearStatus", () => {
  const expenses = [
    { month: "Janeiro", year: 2025, is_paid: true },
    { month: "Janeiro", year: 2025, is_paid: false },
    { month: "Fevereiro", year: 2024, is_paid: true },
  ] as Expense[];

  it("returns all when filters are Todos", () => {
    const result = filterExpenseByMonthYearStatus(expenses, {
      month: "Todos",
      year: "Todos",
      status: "Todos",
    });

    expect(result).toHaveLength(3);
  });

  it("filters by month", () => {
    const result = filterExpenseByMonthYearStatus(expenses, {
      month: "Janeiro",
      year: "Todos",
      status: "Todos",
    });

    expect(result).toHaveLength(2);
  });

  it("filters by year", () => {
    const result = filterExpenseByMonthYearStatus(expenses, {
      month: "Todos",
      year: "2025",
      status: "Todos",
    });

    expect(result).toHaveLength(2);
  });

  it("filters by status Pago", () => {
    const result = filterExpenseByMonthYearStatus(expenses, {
      month: "Todos",
      year: "Todos",
      status: "Pago",
    });

    expect(result).toHaveLength(2);
  });

  it("filters by status À pagar", () => {
    const result = filterExpenseByMonthYearStatus(expenses, {
      month: "Todos",
      year: "Todos",
      status: "À pagar",
    });

    expect(result).toHaveLength(1);
  });

  it("combines all filters", () => {
    const result = filterExpenseByMonthYearStatus(expenses, {
      month: "Janeiro",
      year: "2025",
      status: "Pago",
    });

    expect(result).toHaveLength(1);
    expect(result[0].is_paid).toBe(true);
  });

  it("returns empty array if expenses empty", () => {
    const result = filterExpenseByMonthYearStatus([], {
      month: "Janeiro",
      year: "2025",
      status: "Pago",
    });

    expect(result).toEqual([]);
  });
});

describe("filterRevenue", () => {
  const revenue = [
    { date: "2025-01-10", value: 100 },
    { date: "2025-01-20", value: 200 },
    { date: "2025-02-10", value: 300 },
  ] as Revenue[];

  it("filters revenue by month and year", () => {
    const result = filterRevenue(revenue, 1, 2025);

    expect(result).toHaveLength(2);
  });

  it("returns empty array when no match", () => {
    const result = filterRevenue(revenue, 3, 2025);

    expect(result).toHaveLength(0);
  });

  it("returns undefined when revenue empty", () => {
    const result = filterRevenue([], 1, 2025);

    expect(result).toBeUndefined();
  });
});