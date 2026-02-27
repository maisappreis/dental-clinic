import styles from "./styles/Content.module.css";
import Calendar from "@/app/pages/calendar/page";
import Dashboard from "@/app/pages/dashboard/page";
import RevenuePage from "@/app/pages/revenue/page";
import ExpensePage from "@/app/pages/expense/page";
import MonthClosingPage from "@/app/pages/monthclosing/page";


export default function Content({ selectedOption }: { selectedOption: string }) {
  let contentComponent: React.ReactNode;

  switch (selectedOption) {
    case "calendar":
      contentComponent = <Calendar />;
      break;
    case "dashboard":
      contentComponent = <Dashboard />;
      break;
    case "revenue":
      contentComponent = <RevenuePage />;
      break;
    case "expense":
      contentComponent = <ExpensePage />;
      break;
    case "monthClosing":
      contentComponent = <MonthClosingPage />;
      break;

    default:
      contentComponent = null;
  };

  return (
    <div className={styles.content}>
      {contentComponent}
    </div>
  )
}
