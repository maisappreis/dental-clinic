import { Revenue } from "@/types/revenue";

const PRIORITY_PAYMENTS = ["Débito", "Crédito à vista", "Crédito à prazo"];

export function orderRevenue(revenue: Revenue[]): Revenue[] {
  const priority = revenue
    .filter(r => PRIORITY_PAYMENTS.includes(r.payment))
    .sort(
      (a, b) =>
        new Date(a.release_date).getTime() -
        new Date(b.release_date).getTime()
    );

  const others = revenue.filter(r => !PRIORITY_PAYMENTS.includes(r.payment));

  return [...priority, ...others];
};

interface Rates {
  debit: number;
  cashCredit: number;
  installmentCredit: number;
};

export function calculateNetRevenue(
  revenue: Revenue[],
  rates: Rates
): Revenue[] {
  return revenue.map(item => {
    let netValue = item.value;

    if (item.payment === "Débito") {
      netValue -= item.value * (rates.debit / 100);
    }

    if (item.payment === "Crédito à vista") {
      netValue -= item.value * (rates.cashCredit / 100);
    }

    if (item.payment === "Crédito à prazo") {
      netValue -= item.value * (rates.installmentCredit / 100);
    }

    return {
      ...item,
      net_value: Number(netValue.toFixed(2)),
    };
  });
};