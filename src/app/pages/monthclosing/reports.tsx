import styles from "./MonthClosing.module.css";
import { MonthClosingProps } from '@/types/monthClosing';

interface ReportsProps {
  monthClosingList: MonthClosingProps[];
  setSelectedMonthClosing: (newSelectedMonthClosing: MonthClosingProps) => void;
  setSelectedTab: (newSelectedTab: string) => void;
  disableTabForward: () => void;
  filterRevenue: (month: number, year: number) => void;
}

export default function Reports(
  { monthClosingList, setSelectedMonthClosing, setSelectedTab, disableTabForward, filterRevenue }: ReportsProps
) {

  const openReport = (id: number)=> {
    const selectedReport = monthClosingList.find(e => e.id === id);

    if (selectedReport) {
      setSelectedMonthClosing(selectedReport);
      setSelectedTab("tab1");
      disableTabForward();

      filterRevenue(selectedReport.month, selectedReport.year);
    }
  }

  return (
    <div className="flex justify-left w-full flex-wrap">
      {monthClosingList && monthClosingList.length > 0 ?
        monthClosingList.map((report) => (
          <div
            key={report.id}
            className={`${styles.box}`}
            style={{ marginBottom: 20 }}
            onClick={() => openReport(report.id)}
            >
            {report.reference}
          </div>
        ))
        : <div className="no-data">Nenhum resultado encontrado.</div>
      }
    </div>
  )
}