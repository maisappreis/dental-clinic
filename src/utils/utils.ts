import { getMonthAndYear } from "@/utils/date";
import { ExpenseFormData } from "@/types/expense";

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

export const prepareDataForSubmission = (data: ExpenseFormData) => {
  if (data.date) {
    const [month, year] = getMonthAndYear(data.date);
    return {
      ...data,
      month,
      year: parseInt(year),
      name: capitalizeFirstLetter(data.name),
    };
  } else {
    return {
      ...data,
      name: capitalizeFirstLetter(data.name),
    };
  }
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