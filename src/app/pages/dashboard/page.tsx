import RevenueExpensesChart from "@/app/charts/revenue";
import ProfitChart from "@/app/charts/profit";
import ProceduresChart from "@/app/charts/procedures";

export default function Dashboard() {
  return (
    <div className="content">
        <RevenueExpensesChart />
      <div className="flex">
        <ProceduresChart />
        <ProfitChart />
      </div>
    </div>
  );
};


