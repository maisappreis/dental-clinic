import { http } from "@/api/http";
import { apiURL } from "@/api/base";
import {
  Appointment,
  CreateAppointmentDTO,
  UpdateAppointmentDTO
} from "@/types/agenda";

export const AgendaService = {
  async list(): Promise<Appointment[]> {
    const { data } = await http.get(`${apiURL()}/appointment/`);
    return data;
  },

  async create(payload: CreateAppointmentDTO): Promise<Appointment> {
    const { data } = await http.post(`${apiURL()}/appointment/create/`, payload);
    return data;
  },

  async update(payload: UpdateAppointmentDTO): Promise<Appointment> {
    const { data } = await http.patch(`${apiURL()}/appointment/${payload.id}/`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${apiURL()}/appointment/${id}/`);
  },
};