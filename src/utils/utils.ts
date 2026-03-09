const LOWERCASE_WORDS = ["da", "de", "do", "das", "dos", "e"];

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return "";

  return text
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) =>
      index > 0 && LOWERCASE_WORDS.includes(word)
        ? word
        : word[0].toUpperCase() + word.slice(1)
    )
    .join(" ");
};

export function formatValueToBRL(value: number): string {
  if (typeof value !== "number" || isNaN(value)) return "";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatCPF = (value: string = ""): string => {
  const numbers = value.replace(/\D/g, "").slice(0, 11);

  return numbers
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
};