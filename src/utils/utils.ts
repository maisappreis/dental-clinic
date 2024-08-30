import { RevenueList } from "@/types/revenue";
import { ExpenseList } from "@/types/expense";
import { MonthNames } from '@/types/chart';
import { monthNames } from "@/assets/data";

export const capitalize = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function calculateMonthlyTotals(revenue: RevenueList, expenses: ExpenseList) {
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(new Date().setMonth(new Date().getMonth() - i)).toISOString().slice(0, 7)
  ).reverse();

  const monthlyRevenue = months.map(month => {
    return revenue
      .filter(item => item.date.startsWith(month))
      .reduce((sum, item) => sum + item.value, 0);
  });

  const monthlyExpenses = months.map(month => {
    return expenses
      .filter(item => item.date.startsWith(month))
      .reduce((sum, item) => sum + item.value, 0);
  });

  const monthsLabels = months.map(date => {
    const [year, month] = date.split("-");
    return `${monthNames[month as keyof MonthNames]} ${year}`;
  });

  return { monthsLabels, monthlyRevenue, monthlyExpenses };
}

export function calculateMonthlyProfit(revenue: RevenueList, expenses: ExpenseList) {
  const { monthsLabels, monthlyRevenue, monthlyExpenses } = calculateMonthlyTotals(revenue, expenses);

  const monthlyProfit = monthlyRevenue.map((revenue, index) => {
    return revenue - monthlyExpenses[index];
  });

  return { monthsLabels, monthlyProfit };
}