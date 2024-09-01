"use client";
import { useMemo } from "react";
import styles from "./Calendar.module.css";
import Appointments from "./appointments";

const dataComingFromBack = [
  { date: "2024-09-02", time: "09:00", patient: "Luis Silva", notes: "" },
  { date: "2024-09-02", time: "10:00", patient: "Renan Bern", notes: "" },
  { date: "2024-09-03", time: "11:00", patient: "Amanda Lopes", notes: "" },
  { date: "2024-09-03", time: "13:00", patient: "Bianca", notes: "" },
  { date: "2024-09-03", time: "14:00", patient: "Duff Preis", notes: "Muito lindo" },
  { date: "2024-09-04", time: "15:00", patient: "Luis Silva", notes: "" },
  { date: "2024-09-04", time: "16:00", patient: "José", notes: "" },
  { date: "2024-09-04", time: "17:00", patient: "Maisa Preis", notes: "" },
  { date: "2024-09-05", time: "18:00", patient: "Bia", notes: "" },
]

const times = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const initialFormat = [
  { date: "", time: "", name: "", notes: "" },
  { date: "", time: "", name: "", notes: "" },
  { date: "", time: "", name: "", notes: "" },
  { date: "", time: "", name: "", notes: "" },
  { date: "", time: "", name: "", notes: "" },
  { date: "", time: "", name: "", notes: "" },
];

export default function Calendar() {

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

  const initialAppointments = times.map(time => ({
    time,
    patients: initialFormat.map(patient => ({ ...patient, time }))
  }));

  const appointments = useMemo(() => {
    const updatedAppointments = [...initialAppointments];

    dataComingFromBack.forEach(({ date, time, patient, notes }) => {
      const dayIndex = daysOfWeek.findIndex(day => day.date === date);
      if (dayIndex !== -1) {
        const appointment = updatedAppointments.find(a => a.time === time);
        if (appointment) {
          appointment.patients[dayIndex] = {
            date,
            time,
            name: patient,
            notes: notes,
          };
        }
      }
    });

    return updatedAppointments;
  }, [daysOfWeek, initialAppointments]);

  return (
    <div className="content">
      <div className={styles.grid}>
        <div className={`${styles.week} ${styles.time} ${styles.font}`}>Horários</div>
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
    </div>
  )
}