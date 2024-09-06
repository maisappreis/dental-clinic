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
export function formatDate (date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

// Receives a date and returns the same date in the next month.
export function getNextMonth(date: string): string {
  const currentDate = new Date(date);
  currentDate.setMonth(currentDate.getMonth() + 1);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// Receives a month name and returns the next month name.
export function getNextMonthName(currentMonth: string): string {
  const validMonths = months.slice(0, 12);
  const currentIndex = validMonths.indexOf(currentMonth);

  if (currentIndex === -1) {
    throw new Error("Mês inválido");
  }
  
  const nextIndex = (currentIndex + 1) % validMonths.length;
  
  return validMonths[nextIndex];
}