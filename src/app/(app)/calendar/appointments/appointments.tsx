"use client";

import styles from "../Calendar.module.css";
import { CalendarSlot } from "@/types/agenda";

export interface AppointmentsProps {
  time: string;
  slots: CalendarSlot[];
  onOpen: (slot: CalendarSlot) => void;
}

export function Appointments({
  time,
  slots,
  onOpen
}: AppointmentsProps) {

  const shortName = (name: string): string => {
    if (name && name.length > 9) {
      return `${name.slice(0, 9)}..`
    } else {
      return name
    }
  };

  return (
    <>
      <div className={styles.time}>{time}</div>
      {slots.map((slot, index) => (
        <button
          key={index}
          className={styles.appointment}
          onClick={() => onOpen(slot)}>
          <div className="flex justify-center">
            <p className={styles.text}>
              {slot.appointment?.name ? shortName(slot.appointment?.name) : ""}
            </p>
          </div>
        </button>
      ))}
    </>
  );
};