import { months } from "@/constants/date";

export type MonthName = typeof months[number];

const today = ():Date => new Date();
const currentYear = (): string => today().getFullYear().toString();

const pad = (value: number): string => String(value).padStart(2, "0");
const formatISO = (date: Date): string => `${currentYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export function getCurrentDate(): string {
  return formatISO(today());
};

export function getCurrentYear(): string {
  const year = currentYear();
  return year.toString()
};

export function getCurrentMonth(): string {
  const currentMonthIndex = today().getMonth();
  return months[currentMonthIndex];
};

export function getMonthName(monthNumber: string): MonthName {
  const index = Number(monthNumber) - 1;

  if (!Number.isInteger(index) || index < 0 || index >= months.length) {
    throw new Error(`Mês inválido: ${monthNumber}`);
  }

  return months[index];
};

export function getMonthAndYear(date: string): [string, string] {
  const month = getMonthName(date.split("-")[1])
  const year = date.split("-")[0]
  return [month, year]
};

export function formatDate (date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

export function getNextMonth(date: string): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  return formatISO(d);
};

export function getNextMonthName(currentMonth: string): MonthName {
  const validMonths = months.slice(0, 12);
  const currentIndex = validMonths.indexOf(currentMonth);

  if (currentIndex === -1) {
    throw new Error("Mês inválido");
  }
  
  const nextIndex = (currentIndex + 1) % validMonths.length;
  
  return validMonths[nextIndex];
};

export interface WeekDay {
  dayWeek: string;
  day: string;
  date: string;
}

export function getCurrentWeekDays(): WeekDay[] {
  const base = new Date();
  const mondayOffset = base.getDay() === 0 ? -6 : 1 - base.getDay();

  const weekLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return weekLabels.map((label, index) => {
    const d = new Date(base);
    d.setDate(base.getDate() + mondayOffset + index);

    return {
      dayWeek: label,
      day: d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`,
    };
  });
};