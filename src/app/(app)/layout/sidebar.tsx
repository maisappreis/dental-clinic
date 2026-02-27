"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logotype } from "./logotype";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCalendar,
  faHandHoldingDollar,
  faMoneyBillTransfer,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/Sidebar.module.css";


const options = [
  { path: "/calendar", icon: faCalendar, label: "Agenda" },
  { path: "/dashboard", icon: faChartLine, label: "Métricas" },
  { path: "/revenue", icon: faHandHoldingDollar, label: "Receitas" },
  { path: "/expense", icon: faMoneyBillTransfer, label: "Despesas" },
  { path: "/monthclosing", icon: faBook, label: "Caixa Mensal" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Logotype />

      <ul>
        {options.map(option => {
          const isActive = pathname.startsWith(option.path);

          return (
            <li key={option.path}>
              <Link
                href={option.path}
                className={`${styles.option} ${
                  isActive ? styles.selected : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={option.icon}
                  className={`${styles.icon} ${
                    isActive ? styles.selectedIcon : ""
                  }`}
                />
                <span className={styles.text}>{option.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};