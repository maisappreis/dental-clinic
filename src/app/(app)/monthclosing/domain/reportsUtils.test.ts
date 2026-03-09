import { getDefaultCashClosingForm } from "./reportsUtils";
import { getCurrentYear, getCurrentMonth } from "@/utils/date";

jest.mock("@/utils/date", () => ({
  getCurrentYear: jest.fn(),
  getCurrentMonth: jest.fn(),
}));

describe("getDefaultCashClosingForm", () => {
  it("returns previous month in same year", () => {
    (getCurrentYear as jest.Mock).mockReturnValue("2025");
    (getCurrentMonth as jest.Mock).mockReturnValue("Março");

    const result = getDefaultCashClosingForm();

    expect(result).toEqual({
      month: "Fevereiro",
      monthNumber: 2,
      year: "2025",
      revenueCheck: false,
      expensesCheck: false,
    });
  });

  it("handles January and returns December of previous year", () => {
    (getCurrentYear as jest.Mock).mockReturnValue("2025");
    (getCurrentMonth as jest.Mock).mockReturnValue("Janeiro");

    const result = getDefaultCashClosingForm();

    expect(result.month).toBe("Dezembro");
    expect(result.monthNumber).toBe(12);
    expect(result.year).toBe("2024");
  });
});