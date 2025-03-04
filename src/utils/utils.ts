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