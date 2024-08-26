'use client'

import Calendar from "@/app/pages/calendar/page";
import Dashboard from "@/app/pages/dashboard/page";
import Revenue from "@/app/pages/revenue/page";
import Expense from "@/app/pages/expense/page";
import MonthEndClosing from "@/app/pages/monthclosing/page";
import style from "./styles/Content.module.css";
import { DataProvider } from "@/app/context/DataContext"

export default function Content({ selectedOption }: { selectedOption: string}) {
  let contentComponent: React.ReactNode;

  switch (selectedOption) {
    case "calendar":
      contentComponent = <Calendar />;
      break;
    case "dashboard":
      contentComponent = <Dashboard />;
      break;
    case "revenue":
      contentComponent = <Revenue />;
      break;
    case "expense":
      contentComponent = <Expense />;
      break;
    case "monthEndClosing":
      contentComponent = <MonthEndClosing />;
      break;

    default:
      contentComponent = null;
  }

  return (
    <DataProvider>
    <div className={style.content}>
      {contentComponent}
    </div>
    </DataProvider>
  )
}