"use client";
import { useState, useMemo } from "react";
import styles from "./Calendar.module.css";
import Appointments from "./appointments";
import Modal from "@/app/common/modal";
import AppointmentForm from "./form";
import { scheduleOptions, initialAppointmentFormat } from "@/assets/data"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { AgendaData } from "@/types/agenda";

export default function Calendar({ agenda = [], setAgenda, loading }: AgendaData) {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const daysOfWeek = useMemo(() => {
    const today = new Date();
    const startOfWeek = today.getDate() - today.getDay() + 1;
    const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    return days.map((day, index) => {
      const currentDay = new Date(today.setDate(startOfWeek + index));
      const dayFormatted = currentDay.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });

      const formattedDate = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(currentDay.getDate()).padStart(2, '0')}`;

      return { dayWeek: day, day: dayFormatted, date: formattedDate };
    });
  }, []);

  const initialAppointments = scheduleOptions.map(time => ({
    time,
    patients: daysOfWeek.map(day => ({
      ...initialAppointmentFormat[0],
      time,
      date: day.date
    }))
  }));

  const appointments = useMemo(() => {
    const updatedAppointments = [...initialAppointments];

    agenda.forEach(({ id, date, time, name, notes }) => {
      const dayIndex = daysOfWeek.findIndex(day => day.date === date);
      if (dayIndex !== -1) {
        const appointment = updatedAppointments.find(a => a.time === time);
        if (appointment) {
          appointment.patients[dayIndex] = {
            id,
            date,
            time,
            name,
            notes: notes,
          };
        }
      }
    });

    return updatedAppointments;
  }, [daysOfWeek, initialAppointments, agenda]);

  const addAppointment = () => {
    setShowModal(true);
    setModalTitle("Novo Agendamento");
  }

  const closeModal = () => {
    setShowModal(false);
  }

  if (loading) {
    return (
      <div className="content">
        <div className="w-full h-full flex justify-center">
          <h1 className="mt-5 font-bold text-xl">Carregando agenda...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className={styles.grid}>
        <div className={`${styles.week} ${styles.time} ${styles.font} cursor-pointer`}
          onClick={addAppointment}>
          <FontAwesomeIcon icon={faPlus} className={styles.icon} />
        </div>
        {daysOfWeek.map((day, index) => (
          <div key={index} className={`${styles.week} ${styles.header} ${styles.font}`}>
            <span>{day.dayWeek}</span>
            <span>{day.day}</span>
          </div>
        ))}
        {appointments.map((appointment) => (
          <Appointments key={appointment.time} time={appointment.time} patients={appointment.patients} setAgenda={setAgenda} />
        ))}
      </div>
      {showModal &&
        <Modal title={modalTitle}>
          <AppointmentForm setAgenda={setAgenda} closeModal={closeModal} />
        </Modal>
      }
    </div>
  )
}