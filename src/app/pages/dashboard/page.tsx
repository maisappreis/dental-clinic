import RevenueExpensesChart from "@/app/charts/revenue";
import ProfitChart from "@/app/charts/profit";
import NumberOfProceduresChart from "@/app/charts/proceduresNumber";
import MostPerformedProceduresChart from "@/app/charts/proceduresFrequency";
import styles from "@/app/pages/dashboard/Charts.module.css";
import { RevenueList } from '@/types/revenue';
import { ExpenseList } from '@/types/expense';

export default function Dashboard(
  { revenue, expenses }: { revenue: RevenueList, expenses: ExpenseList }
) {
  return (
    <div className="content align-middle">
      <div id="area" className={styles.area}>
        <RevenueExpensesChart revenue={revenue} expenses={expenses} />
        <MostPerformedProceduresChart revenue={revenue} />
      </div>
      <div id="area" className={styles.area}>
        <NumberOfProceduresChart revenue={revenue} />
        <ProfitChart revenue={revenue} expenses={expenses} />
      </div>
    </div>
  );
};


