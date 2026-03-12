"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import { usePathname, useRouter } from "next/navigation";
import { Logotype } from "../logotype/logotype";
import { useUserStore } from "@/stores/user.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCalendar,
  faHandHoldingDollar,
  faMoneyBillTransfer,
  faRightToBracket,
  faBook,
} from "@fortawesome/free-solid-svg-icons";


const options = [
  { path: "/calendar", icon: faCalendar, label: "Agenda" },
  { path: "/dashboard", icon: faChartLine, label: "Métricas" },
  { path: "/revenue", icon: faHandHoldingDollar, label: "Receitas" },
  { path: "/expense", icon: faMoneyBillTransfer, label: "Despesas" },
  { path: "/monthclosing", icon: faBook, label: "Caixa Mensal" },
];

export function Sidebar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const pathname = usePathname();
  const clearUser = useUserStore((s) => s.clearUser);

  const router = useRouter();

  const loginUser = () => {
    router.push("/login");
  };

  const logoutUser = () => {
    clearUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

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

      <div>
        <div className="divider"></div>

        {isAuthenticated ? (
          <button className={styles.userlog} onClick={logoutUser}>
            <FontAwesomeIcon
              icon={faRightToBracket}
              className={styles.icon}
            />
            <span className={styles.text}>Logout</span>
          </button>
          ) : (
          <button className={styles.userlog} onClick={loginUser}>
            <FontAwesomeIcon
              icon={faRightToBracket}
              className={styles.icon}
            />
            <span className={styles.text}>Login</span>
          </button>
        )}
      </div>
    </aside>
  );
};