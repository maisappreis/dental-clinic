import RevenueExpensesChart from "@/app/charts/revenue";
import ProfitChart from "@/app/charts/profit";
import NumberOfProceduresChart from "@/app/charts/proceduresNumber";
import MostPerformedProceduresChart from "@/app/charts/proceduresFrequency";
import styles from "@/app/pages/dashboard/Charts.module.css";
import { RevenueProps } from '@/types/revenue';
import { ExpenseProps } from '@/types/expense';

export default function Dashboard(
  { revenue, expenses, profit }: { revenue: RevenueProps[], expenses: ExpenseProps[], profit: {profit: number[], labels: string[]} }
) {
  return (
    <div className="content align-middle">
      <div id="area" className={styles.area}>
        <RevenueExpensesChart revenue={revenue} expenses={expenses} />
        <MostPerformedProceduresChart revenue={revenue} />
      </div>
      <div id="area" className={styles.area}>
        <NumberOfProceduresChart revenue={revenue} />
        <ProfitChart profit={profit} />
      </div>
    </div>
  );
};


