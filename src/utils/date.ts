import { months } from "@/assets/data";


// Returns the current year as a string.
export function getCurrentYear(): string {
  const year = new Date().getFullYear();
  return year.toString()
}

// Returns the current month as a string.
export function getCurrentMonth(): string {
  const currentMonthIndex = new Date().getMonth();
  return months[currentMonthIndex];
}

// Receives a month number and returns month name.
function getMonthName(monthNumber: string): string {
  const index = parseInt(monthNumber, 10) - 1;

  if (index >= 0 && index < months.length) {
    return months[index];
  } else {
    return "Mês inválido";
  }
}

// Receives a date and returns month and year in string.
export function getMonthAndYear(date: string): string [] {
  const month = getMonthName(date.split("-")[1])
  const year = date.split("-")[0]
  return [month, year]
}