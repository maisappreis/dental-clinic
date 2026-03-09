import { useState, useCallback } from "react";
import { AgendaService } from "@/services/agenda.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";
import { capitalizeFirstLetter } from '@/utils/utils';
import { Appointment, CreateAppointmentDTO, UpdateAppointmentDTO } from "@/types/agenda";

export function useAgenda(initialAppointment: Appointment[] = []) {
  const [agenda, setAgenda] = useState<Appointment[]>(initialAppointment);
  const [isLoading, setIsLoading] = useState(true);

  const alert = useAlertStore.getState();
  const showLoading = useLoadingStore((s) => s.show);
  const hideLoading = useLoadingStore((s) => s.hide);

  const refresh = useCallback(async () => {
    const data = await AgendaService.list();
    setAgenda(data);
  }, []);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      await refresh();
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const create = async (payload: CreateAppointmentDTO) => {
    showLoading("Criando agendamento...");
    try {
      const formatedPayload = {
        ...payload,
        name: capitalizeFirstLetter(payload.name),
      };

      await AgendaService.create(formatedPayload);
      await refresh();

      alert.show({
        message: "Agendamento criado com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      alert.show({
        message: "Erro ao criar agendamento.",
        variant: "error",
      });
    } finally {
      hideLoading();
    }
  };

  const update = async (payload: UpdateAppointmentDTO) => {
    showLoading("Atualizando agendamento...");
    try {
      const formatedPayload = {
        ...payload,
        name: capitalizeFirstLetter(payload.name),
      };

      const updatedAppointment = await AgendaService.update(formatedPayload);
      await refresh();

      alert.show({
        message: "Agendamento atualizado com sucesso!",
        variant: "success",
      });
      
      return updatedAppointment;
    } catch (error) {
      console.error(error);
      alert.show({
        message: "Erro ao atualizar agendamento.",
        variant: "error",
      });
    } finally {
      hideLoading();
    }
  };

  const remove = async (id: number) => {
    showLoading("Excluindo agendamento...");
    try {
      await AgendaService.remove(id);
      await refresh();

      alert.show({
        message: "Agendamento excluído com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      alert.show({
        message: "Erro ao excluir agendamento.",
        variant: "error",
      });
    } finally {
      hideLoading();
    }
  };

  return {
    agenda,
    isLoading,
    fetch,
    refresh,
    create,
    update,
    remove,
  };
};