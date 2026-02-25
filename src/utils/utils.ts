// Capitalizes the first letter of a string
export const capitalize = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format monetary value to BRL
export function formatValueToBRL(value: number): string {
  if (isNaN(value)) {
    return ""
  }
  const formattedValue = value.toFixed(2);
  const [integerPart, decimalPart] = formattedValue.split('.');
  const integerPartWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `R$ ${integerPartWithCommas},${decimalPart}`;
}

// Format CPF
export const formatCPF = (cpf: string): string => {
  const numbers = cpf.replace(/\D/g, '');

  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};