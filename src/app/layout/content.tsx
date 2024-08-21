'use client'

import Calendar from "@/app/pages/calendar/page";
import Dashboard from "@/app/pages/dashboard/page";
import Revenue from "@/app/pages/revenue/page";
import Expense from "@/app/pages/expense/page";
import MonthEndClosing from "@/app/pages/monthclosing/page";
import style from "./styles/Content.module.css";

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
    <div className={style.content}>
      {contentComponent}


      {/* <MetricsPage
            v-if="selectedPage === 'metrics'"
            :customers="customers"
            :revenue="revenue"
            :expenses="expenses"
            @updateData="getData"
        />
        <CustomersPage
            v-if="selectedPage === 'customers'"
            :customers="customers"
            :revenue="revenue"
            :selectedPage="selectedPage"
            @updateData="getData"
        />
        <RevenuePage
            v-if="selectedPage === 'revenue'"
            :revenue="revenue"
            :customers="customers"
            :selectedPage="selectedPage"
            @updateData="getData"
        />
        <ExpensesPage
            v-if="selectedPage === 'expenses'"
            :expenses="expenses"
            :selectedPage="selectedPage"
            @updateData="getData"
        /> */}
    </div>
  )
}