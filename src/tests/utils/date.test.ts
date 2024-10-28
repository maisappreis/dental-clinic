import {
  getCurrentDate,
  getCurrentYear,
  getCurrentMonth,
  getMonthName,
  getMonthAndYear,
  formatDate,
  getNextMonth,
  getNextMonthName
} from "@/utils/date";
import { months } from "@/assets/data";

describe("Date Utils Functions", () => {

  it("getCurrentDate should return the current date as a string", () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const expectedDate = `${year}-${month}-${day}`;
    expect(getCurrentDate()).toBe(expectedDate);
  });

  it("getCurrentYear should return the current year as a string", () => {
    const expectedYear = new Date().getFullYear().toString();
    expect(getCurrentYear()).toBe(expectedYear);
  });

  it("getCurrentMonth should return the current month name", () => {
    const currentMonthIndex = new Date().getMonth();
    const expectedMonth = months[currentMonthIndex];
    expect(getCurrentMonth()).toBe(expectedMonth);
  });

  // it("getMonthName should receives a month number and returns month name", () => {
  //   const monthNumber = "12";
  //   const monthNumberError = "13";
  //   expect(getMonthName(monthNumber)).toBe("Dezembro");
  //   expect(getMonthName(monthNumberError)).toBe("Mês inválido");
  // });

  it("getMonthAndYear should return the month name and year from a date string", () => {
    const date = "2024-10-25";
    const expected = [months[9], "2024"]; // Outubro (10)
    expect(getMonthAndYear(date)).toEqual(expected);
  });

  it("formatDate should format the date to 'day/month/year' string", () => {
    const date = "2024-10-25";
    expect(formatDate(date)).toBe("25/10/2024");
  });

  // it("getNextMonth should return the same date in the next month", () => {
  //   const date = "2024-10-25";
  //   const expectedNextMonthDate = "2024-11-25"; // 25 de Novembro de 2024
  //   expect(getNextMonth(date)).toBe(expectedNextMonthDate);
  // });

  it("getNextMonthName should return the next month name", () => {
    const currentMonth = months[9]; // Outubro
    const expectedNextMonth = months[10]; // Novembro
    expect(getNextMonthName(currentMonth)).toBe(expectedNextMonth);
  });

  it("getNextMonthName should throw an error for an invalid month", () => {
    expect(() => getNextMonthName("Mês Inexistente")).toThrow("Mês inválido");
  });

});
