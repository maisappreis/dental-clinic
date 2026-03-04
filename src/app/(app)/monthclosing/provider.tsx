"use client";

import { createContext, useContext, useState } from "react";
import { Revenue } from "@/types/revenue";
import { MonthClosing } from "@/types/monthClosing";

interface MonthClosingContextData {
  selectedMonthClosing?: MonthClosing;
  closingRevenue: Revenue[];
  mode: "create" | "edit";
  
  setSelectedMonthClosing: (data: MonthClosing) => void;
  setClosingRevenue: (data: Revenue[]) => void;
  setMode: (mode: "create" | "edit") => void;
};

const MonthClosingContext = createContext<MonthClosingContextData | null>(null);

export function MonthClosingProvider({ children }: { children: React.ReactNode }) {
  const [selectedMonthClosing, setSelectedMonthClosing] = useState<MonthClosing>();
  const [closingRevenue, setClosingRevenue] = useState<Revenue[]>([]);
  const [mode, setMode] = useState<"create" | "edit">("create");

  return (
    <MonthClosingContext.Provider
      value={{
        selectedMonthClosing,
        closingRevenue,
        mode,
        setSelectedMonthClosing,
        setClosingRevenue,
        setMode
      }}
    >
      {children}
    </MonthClosingContext.Provider>
  );
};

export function useMonthClosingFlow() {
  const context = useContext(MonthClosingContext);
  
  if (!context) {
    throw new Error("useMonthClosingFlow must be used inside MonthClosingProvider");
  }
  return context;
};