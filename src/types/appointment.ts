export interface PatientProps {
  id: number;
  date: string;
  time: string;
  name: string;
  notes: string;
}

export interface AppointmentsProps {
  time: string;
  patients: PatientProps[];
}