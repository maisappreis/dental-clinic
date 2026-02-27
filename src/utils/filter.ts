import { Revenue } from "@/types/revenue";
import { Expense } from "@/types/expense";
import { getMonthAndYear } from "@/utils/date";

interface FilterParams {
  month: string;
  year: string;
};

export function filterRevenueByMonthAndYear(
  revenue: Revenue[],
  { month, year }: FilterParams
): Revenue[] {
  if (!revenue.length) return [];

  return revenue.filter(item => {
    const [itemMonth, itemYear] = getMonthAndYear(item.date);

    if (month === "Todos" && year === "Todos") return true;
    if (month === "Todos") return itemYear === year;
    if (year === "Todos") return itemMonth === month;

    return itemMonth === month && itemYear === year;
  });
};

interface ExpenseFilterParams {
  month: string;
  year: string;
  status: "Pago" | "À pagar" | "Todos";
};

export function filterExpenseByMonthYearStatus(
  expenses: Expense[],
  { month, year, status }: ExpenseFilterParams
): Expense[] {
  if (!expenses.length) return [];

  const hasMonthFilter = month !== "Todos";
  const hasYearFilter = year !== "Todos";
  const hasStatusFilter = status !== "Todos";

  return expenses.filter((expense) => {
    if (hasMonthFilter && expense.month !== month) return false;
    if (hasYearFilter && expense.year.toString() !== year) return false;

    if (hasStatusFilter) {
      const isPaid = status === "Pago";
      if (expense.is_paid !== isPaid) return false;
    }

    return true;
  });
};