import { RevenueProps } from "@/types/revenue";
import { ExpenseProps } from "@/types/expense";
import { MonthNames } from '@/types/chart';
import { monthNames } from "@/assets/data";

// Capitalizes the first letter of a string
export const capitalize = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Receives Revenue list, a month and a year and return the sum of this specific month.
export function calculateMonthlyRevenue(
  data: RevenueProps[], month: number, year: number,
  dateField: keyof RevenueProps = 'release_date',
  valueField: keyof RevenueProps = 'net_value'): number {

  const filteredData = data.filter(item => {
    const itemDate = new Date(item[dateField as keyof RevenueProps] as string);
    return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year;
  });

  const totalValue = filteredData.reduce((sum, item) => sum + (item[valueField as keyof RevenueProps] as number), 0);

  return totalValue;
}

// Calculates total monthly Revenue and Expenses
export function calculateMonthlyTotals(revenue: RevenueProps[], expenses: ExpenseProps[]) {
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

// Calculates total monthly Profit
export function calculateMonthlyProfit(revenue: RevenueProps[], expenses: ExpenseProps[]) {
  const { monthsLabels, monthlyRevenue, monthlyExpenses } = calculateMonthlyTotals(revenue, expenses);

  const monthlyProfit = monthlyRevenue.map((revenue, index) => {
    return revenue - monthlyExpenses[index];
  });

  return { monthsLabels, monthlyProfit };
}

// Format monetary value to BRL
export function formatValueToBRL(value: number): string {
  if (isNaN(value)) {
    return ""
  }
  const formattedValue = value.toFixed(2);
  const [integerPart, decimalPart] = formattedValue.split('.');
  const integerPartWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `R$ ${integerPartWithCommas},${decimalPart}`;
}