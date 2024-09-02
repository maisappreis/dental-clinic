"use client";
import { useState, useMemo } from "react";
import styles from "./Calendar.module.css";
import Appointments from "./appointments";
import Modal from "@/app/components/modal";
import AppointmentForm from "./form";
import { scheduleOptions, initialAppointmentFormat } from "@/assets/data"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const dataComingFromBack = [
  { id: 1, date: "2024-09-02", time: "09:00", name: "Luis Silva", notes: "" },
  { id: 2, date: "2024-09-02", time: "10:00", name: "Renan Bern", notes: "" },
  { id: 3, date: "2024-09-03", time: "11:00", name: "Amanda Lopes", notes: "" },
  { id: 4, date: "2024-09-03", time: "13:00", name: "Bianca", notes: "" },
  { id: 5, date: "2024-09-03", time: "14:00", name: "Duff Preis", notes: "Muito lindo" },
  { id: 6, date: "2024-09-04", time: "15:00", name: "Luis Silva", notes: "" },
  { id: 7, date: "2024-09-04", time: "16:00", name: "José", notes: "" },
  { id: 8, date: "2024-09-04", time: "17:00", name: "Maisa Preis", notes: "" },
  { id: 9, date: "2024-09-05", time: "18:00", name: "Bia", notes: "" },
]

export default function Calendar() {
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

      return { dayWeek: day, day: dayFormatted, date: currentDay.toISOString().split('T')[0] };
    });
  }, []);

  const initialAppointments = scheduleOptions.map(time => ({
    time,
    patients: initialAppointmentFormat.map(patient => ({ ...patient, time }))
  }));

  const appointments = useMemo(() => {
    const updatedAppointments = [...initialAppointments];

    dataComingFromBack.forEach(({ id, date, time, name, notes }) => {
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
    console.log('updatedAppointments', updatedAppointments)

    return updatedAppointments;
  }, [daysOfWeek, initialAppointments]);

  const addAppointment = () => {
    setShowModal(true);
    setModalTitle("Novo Agendamento");
  }

  const closeModal = () => {
    setShowModal(false);
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
          <Appointments key={appointment.time} time={appointment.time} patients={appointment.patients} />
        ))}
      </div>
      {showModal &&
        <Modal title={modalTitle}>
          <AppointmentForm closeModal={closeModal} />
        </Modal>
      }
    </div>
  )
}