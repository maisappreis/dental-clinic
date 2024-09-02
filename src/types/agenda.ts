export interface AgendaProps {
  id: number;
  date: string;
  time: string;
  name: string;
  notes: string;
}

export type AgendaList = AgendaProps[];

export interface AppointmentsProps {
  time: string;
  patients: AgendaProps[];
  setAgenda: (newAgenda: AgendaProps[]) => void;
}

export interface DataAgendaProps {
  agenda: AgendaProps[];
  setAgenda: (newAgenda: AgendaProps[]) => void;
  loading: boolean;
}

