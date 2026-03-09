import { months, years } from "@/constants/date";
import { getCurrentYear, getCurrentMonth } from "@/utils/date";
import { CashClosingFormState } from "@/types/monthClosing";


export function getDefaultCashClosingForm(): CashClosingFormState {
  const currentYear = getCurrentYear();
  const currentMonth = getCurrentMonth();

  if (currentMonth === "Janeiro") {
    return {
      month: "Dezembro",
      monthNumber: 12,
      year: years[years.indexOf(currentYear) - 1],
      revenueCheck: false,
      expensesCheck: false,
    };
  }

  const monthIndex = months.indexOf(currentMonth);

  return {
    month: months[monthIndex - 1],
    monthNumber: monthIndex,
    year: currentYear,
    revenueCheck: false,
    expensesCheck: false,
  };
};