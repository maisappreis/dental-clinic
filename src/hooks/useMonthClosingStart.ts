"use client";

import { useRouter } from "next/navigation";
import { filterRevenue } from "@/utils/filter";
import { useMonthClosingFlow } from "@/app/(app)/monthclosing/provider/provider";
import { useRevenue } from "@/hooks/useRevenue";
import { MonthClosing } from "@/types/monthClosing";
import { Revenue } from "@/types/revenue";

export function useMonthClosingStart() {
  const router = useRouter();
  const { revenue, fetchRevenue } = useRevenue([]);
  const { setSelectedMonthClosing, setClosingRevenue, setMode } = useMonthClosingFlow();

  const ensureRevenue = async (): Promise<Revenue[]> => {
    if (revenue && revenue.length > 0) {
      return revenue;
    }

    return await fetchRevenue();
  };

  const startFromExisting = async (report: MonthClosing) => {
    const revenueData = await ensureRevenue();

    setMode("edit");
    setSelectedMonthClosing(report);

    const filteredRevenue = filterRevenue(
      revenueData,
      report.month,
      report.year
    );

    if (!filteredRevenue) return;
    setClosingRevenue(filteredRevenue);

    router.push("/monthclosing/tab1");
  };

  const startNew = async (
    monthClosing: MonthClosing
  ) => {
    const revenueData = await ensureRevenue();

    setMode("create");
    setSelectedMonthClosing(monthClosing);

    const filteredRevenue = filterRevenue(
      revenueData,
      monthClosing.month,
      monthClosing.year
    );

    if (!filteredRevenue) return;
    setClosingRevenue(filteredRevenue);

    router.push("/monthclosing/tab1");
  };

  return {
    startFromExisting,
    startNew,
  };
};