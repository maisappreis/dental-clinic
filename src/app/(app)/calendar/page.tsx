"use client";

import { useState, useMemo, useEffect } from "react";
import styles from "./Calendar.module.css";
import { Appointments } from "@/app/(app)/calendar/appointments/appointments";
import { CreateUpdateModal } from "@/app/(app)/calendar/modals/createUpdate";
import { DeleteModal } from "@/app/(app)/calendar/modals/delete";
import { ReadOnlyModal } from "@/app/(app)/calendar/modals/readOnly";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { scheduleOptions } from "@/constants/appointment";
import { getCurrentWeekDays } from "@/utils/date";
import { useAgenda } from "@/hooks/useAgenda";
import {
  Appointment,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  SelectedAppointment,
  CalendarSlot,
  CalendarRow
} from "@/types/agenda";


export default function Calendar() {
  const [selectedAppointment, setSelectedAppointment] = useState<SelectedAppointment>({ mode: null });
  const [createUpdateModalIsOpen, setCreateUpdateModalIsOpen] = useState<boolean>(false);
  const [readyOnlyModalIsOpen, setReadyOnlyModalIsOpen] = useState<boolean>(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

  const { agenda, create, update, remove, fetch } = useAgenda([]);

  const daysOfWeek = useMemo(() => getCurrentWeekDays(), []);

  const initialAppointments = useMemo<CalendarRow[]>(() => {
    return scheduleOptions.map(time => ({
      time,
      slots: daysOfWeek.map(day => ({
        date: day.date,
        time,
        appointment: undefined,
      })),
    }));
  }, [daysOfWeek]);

  const appointments = useMemo(() => {
    const grid = initialAppointments.map(row => ({
      ...row,
      slots: row.slots.map(slot => ({ ...slot })),
    }));

    agenda.forEach(appointment => {
      const row = grid.find(r => r.time === appointment.time);
      const colIndex = daysOfWeek.findIndex(d => d.date === appointment.date);

      if (row && colIndex !== -1) {
        row.slots[colIndex].appointment = appointment;
      }
    });

    return grid;
  }, [agenda, daysOfWeek, initialAppointments]);

  const openCreateModal = () => {
    setSelectedAppointment({
      mode: "create",
      draft: {
        date: "",
        time: "",
        name: "",
        notes: "",
      },
    });
    setCreateUpdateModalIsOpen(true);
  };

  const openUpdateModal = (appointment: UpdateAppointmentDTO): void => {
    setSelectedAppointment({
      mode: "update",
      draft: appointment,
    });
    setCreateUpdateModalIsOpen(true);
  };

  const openDeleteModal = (appointment: Appointment): void => {
    setSelectedAppointment({
      mode: "view",
      appointment,
    });
    setDeleteModalIsOpen(true);
  };

  const openAppointmentModal = (slot: CalendarSlot) => {
    if (slot.appointment) {
      setSelectedAppointment({
        mode: "view",
        appointment: slot.appointment,
      });

      setReadyOnlyModalIsOpen(true);
    } else {
      setSelectedAppointment({
        mode: "create",
        draft: {
          date: slot.date,
          time: slot.time,
          name: "",
          notes: "",
        },
      });
      setCreateUpdateModalIsOpen(true);
    }
  };

  const createAppointment = async (data: CreateAppointmentDTO) => {
    await create(data);
    closeModal();
  };

  const updateAppointment = async (data: UpdateAppointmentDTO) => {
    await update(data);
    closeModal();
  };

  const deleteAppointment = async () => {
    if (selectedAppointment.mode !== "view") return;
    await remove(selectedAppointment.appointment.id);
    closeModal();
  };

  const closeModal = () => {
    setCreateUpdateModalIsOpen(false);
    setReadyOnlyModalIsOpen(false);
    setDeleteModalIsOpen(false);
    setSelectedAppointment({ mode: null });
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="app-content">
      <div className={styles.grid}>
        <div className={styles.addBtn}
          onClick={openCreateModal}>
          <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
        </div>
        {daysOfWeek.map((day, index) => (
          <div key={index} className={styles.day}>
            <span>{day.dayWeek}</span>
            <span>{day.day}</span>
          </div>
        ))}
        {appointments.map((appointment) => (
          <Appointments
            key={appointment.time}
            time={appointment.time}
            slots={appointment.slots}
            onOpen={openAppointmentModal}
          />
        ))}
      </div>

      <ReadOnlyModal
        open={readyOnlyModalIsOpen}
        appointment={selectedAppointment}
        onClose={closeModal}
        onUpdate={openUpdateModal}
        onDelete={openDeleteModal}/>

      <CreateUpdateModal
        open={createUpdateModalIsOpen}
        appointment={selectedAppointment}
        onClose={closeModal}
        onCreate={createAppointment}
        onUpdate={updateAppointment}
      />

      <DeleteModal
        open={deleteModalIsOpen}
        appointment={selectedAppointment}
        onClose={closeModal}
        onDelete={deleteAppointment}
      />
    </div>
  );
};