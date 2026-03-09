export interface Appointment {
  id: number;
  date: string;
  time: string;
  name: string;
  notes: string;
};

export type CreateAppointmentDTO = Omit<Appointment, "id" >;

export type UpdateAppointmentDTO = Appointment;

export interface AppointmentFormData {
  id?: number;
  date: string;
  time: string;
  name: string;
  notes: string;
};

export interface AppointmentFormRef {
  submit: () => void;
};

export type SelectedAppointment =
  | { mode: "view"; appointment: Appointment }
  | { mode: "create"; draft: CreateAppointmentDTO }
  | { mode: "update"; draft: UpdateAppointmentDTO }
  | { mode: null };

export interface CalendarSlot {
  date: string;
  time: string;
  appointment?: Appointment;
};

export interface CalendarRow {
  time: string;
  slots: CalendarSlot[];
};