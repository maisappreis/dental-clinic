
// Allows to search for multiple terms separated by commas
export function applySearch<T extends { name: string }>(
  data: T[],
  search: string
): T[] {
  if (!search.trim()) return data;

  const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const terms = search
    .toLowerCase()
    .split(",")
    .map(term => normalize(term.trim()))
    .filter(Boolean);

  return data.filter(item => {
    const name = normalize(item.name);
    return terms.some(term => name.includes(term));
  });
}