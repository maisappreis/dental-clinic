export interface Appointment {
  id: number;
  date: string;
  time: string;
  name: string;
  notes: string;
}

export interface AppointmentsProps {
  time: string;
  patients: Appointment[];
  setAgenda: (newAgenda: Appointment[]) => void;
}

export interface AgendaData {
  agenda: Appointment[];
  setAgenda: (newAgenda: Appointment[]) => void;
}

