export type SortOrder = "asc" | "desc";

export function sortByDate<T extends { date: string }>(
  data: T[],
  order: SortOrder = "asc"
): T[] {
  return [...data].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();

    if (isNaN(timeA) || isNaN(timeB)) return 0;

    return order === "asc"
      ? timeA - timeB
      : timeB - timeA;
  });
};