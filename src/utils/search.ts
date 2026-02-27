
// Allows to search for multiple terms separated by commas
export function applySearch<T extends { name: string }>(
  data: T[],
  search: string
): T[] {
  if (!search.trim()) return data;

  const terms = search
    .toLowerCase()
    .split(",")
    .map(term => term.trim())
    .filter(Boolean);

  return data.filter(item => {
    const name = item.name.toLowerCase();
    return terms.some(term => name.includes(term));
  });
}