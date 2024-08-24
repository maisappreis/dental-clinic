import { months } from "@/assets/data";


// Returns the current date as string.
export function getCurrentDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

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

// Formats the date to "day/month/year" string.
export function formatDate (dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};