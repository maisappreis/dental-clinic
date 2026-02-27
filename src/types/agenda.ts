export interface Appointment {
  id: number;
  date: string;
  time: string;
  name: string;
  notes: string;
};

export type CreateAppointmentDTO = Omit<Appointment, "id" >;

export type UpdateAppointmentDTO = Appointment;

export interface AppointmentsProps {
  time: string;
  patients: Appointment[];
}
