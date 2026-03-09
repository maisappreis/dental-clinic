import { Revenue } from "@/types/revenue";

export function getMostPerformedProcedures(
  revenue: Revenue[],
  limit = 7
) {
  const procedureCount = revenue.reduce<Record<string, number>>(
    (acc, { procedure }) => {
      acc[procedure] = (acc[procedure] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return Object.entries(procedureCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);
};

export function groupRevenueByMonth(revenue: Revenue[]) {
  return revenue.reduce<Record<string, number>>((acc, curr) => {
    const year = curr.date.slice(0, 4);
    const month = curr.date.slice(5, 7);
    const key = `${year}-${month}`;

    acc[key] = (acc[key] ?? 0) + 1;

    return acc;
  }, {});
};

interface ItemWithDateAndValue {
  date: string;
  value: number;
}

export function groupValuesByMonth<T extends ItemWithDateAndValue>(
  items: T[]
): Record<string, number> {
  return items.reduce((acc, item) => {
    const month = item.date.slice(5, 7);
    const year = item.date.slice(0, 4);
    const key = `${year}-${month}`;

    acc[key] = (acc[key] || 0) + item.value;
    return acc;
  }, {} as Record<string, number>);
};