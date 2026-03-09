import {
  getCurrentDate,
  getCurrentYear,
  getCurrentMonth,
  getMonthName,
  getMonthAndYear,
  formatDate,
  getNextMonth,
  getNextMonthName,
  getCurrentWeekDays,
} from "./date";

import { months } from "@/constants/date";

describe("date utils", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-03-15T10:00:00"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("getCurrentDate", () => {
    it("returns current date in ISO format", () => {
      const result = getCurrentDate();

      expect(result).toBe("2025-03-15");
    });
  });

  describe("getCurrentYear", () => {
    it("returns current year", () => {
      const result = getCurrentYear();

      expect(result).toBe("2025");
    });
  });

  describe("getCurrentMonth", () => {
    it("returns current month name", () => {
      const result = getCurrentMonth();

      expect(result).toBe(months[2]);
    });
  });

  describe("getMonthName", () => {
    it("returns correct month name", () => {
      expect(getMonthName("1")).toBe(months[0]);
      expect(getMonthName("12")).toBe(months[11]);
    });

    it("throws error for invalid month", () => {
      expect(() => getMonthName("0")).toThrow();
      expect(() => getMonthName("14")).toThrow();
      expect(() => getMonthName("abc")).toThrow();
    });
  });

  describe("getMonthAndYear", () => {
    it("extracts month name and year", () => {
      const result = getMonthAndYear("2025-03-10");

      expect(result).toEqual([months[2], "2025"]);
    });
  });

  describe("formatDate", () => {
    it("formats ISO date to dd/mm/yyyy", () => {
      const result = formatDate("2025-03-15");

      expect(result).toBe("15/03/2025");
    });
  });

  describe("getNextMonth", () => {
    it("returns next month keeping ISO format", () => {
      const result = getNextMonth("2025-03-15");

      expect(result).toBe("2025-04-14");
    });

    it("handles year change", () => {
      const result = getNextMonth("2025-12-10");

      expect(result).toBe("2025-01-09");
    });
  });

  describe("getNextMonthName", () => {
    it("returns next month name", () => {
      const result = getNextMonthName(months[0]);

      expect(result).toBe(months[1]);
    });

    it("wraps to first month", () => {
      const result = getNextMonthName(months[11]);

      expect(result).toBe(months[0]);
    });

    it("throws error for invalid month", () => {
      expect(() => getNextMonthName("Invalid")).toThrow();
    });
  });

  describe("getCurrentWeekDays", () => {
    it("returns 6 week days starting monday", () => {
      const result = getCurrentWeekDays();

      expect(result.length).toBe(6);

      expect(result[0]).toHaveProperty("dayWeek");
      expect(result[0]).toHaveProperty("day");
      expect(result[0]).toHaveProperty("date");
    });

    it("returns correct weekday labels", () => {
      const result = getCurrentWeekDays();

      const labels = result.map((d) => d.dayWeek);

      expect(labels).toEqual(["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]);
    });
  });
});