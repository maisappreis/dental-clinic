import { MonthNames } from '@/types/chart';

// Procedure options list
export const procedureOptions: string[] = [
  'Profilaxia',
  'Restauração',
  'Exodontia',
  'Endodontia',
  'Radiografia',
  'Clareamento gel',
  'Clareamento à laser',
  'Placa de bruxismo',
  'Colagem',
  'Fluor',
  'Placa',
  'Provisório',
  'Prótese',
  'Raio X',
  'Remoção de sutura',
  'Bisnaga de clareamento',
  'Cirurgia',
  'Vários procedimentos',
  'Emergência',
  'Selante (por unidade)',
  'Pino fibra de vidro para restauração',
  'Pino metálico Reforpost para restauração',
  'Faceta',
  'Provisório',
  'Coroa metalo-cerâmica',
  'Coroa cerâmica pura',
  'Coroa de acrílico provisório',
  'Coroa de acrílico prensado',
  'Laminado cerâmico por dente',
  'Núcleo',
  'Implante',
  'Pino',
  'Ortodontia',
  'Contenção',
  'Estética'
];

// Payment options list
export const paymentOptions: string[] = [
  'Dinheiro',
  'PIX',
  'Débito',
  'Crédito à vista',
  'Crédito à prazo',
  'Transferência',
  'Cheque'
];

// Installment options list
export const installmentOptions: number[] = [
  2, 3, 4, 5, 6, 7, 8, 9, 10
];

// Month list
export const months: string[] = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Todos os meses"
];

// Year list
export const years: string[] = [
  "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "Todos"
];

// Mapping month names with month numbers
export const monthNames: MonthNames = {
  "01": "Janeiro",
  "02": "Fevereiro",
  "03": "Março",
  "04": "Abril",
  "05": "Maio",
  "06": "Junho",
  "07": "Julho",
  "08": "Agosto",
  "09": "Setembro",
  "10": "Outubro",
  "11": "Novembro",
  "12": "Dezembro"
};

// Schedule options
export const scheduleOptions = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

// Initial appointment format
export const initialAppointmentFormat = [
  { id: 0, date: "", time: "", name: "", notes: "" },
  { id: 0, date: "", time: "", name: "", notes: "" },
  { id: 0, date: "", time: "", name: "", notes: "" },
  { id: 0, date: "", time: "", name: "", notes: "" },
  { id: 0, date: "", time: "", name: "", notes: "" },
  { id: 0, date: "", time: "", name: "", notes: "" },
];