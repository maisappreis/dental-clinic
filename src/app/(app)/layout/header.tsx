"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./styles/Header.module.css";
import { HEADER_CONFIG } from "@/constants/header";

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const pathname = usePathname();
  
  const headerConfig = HEADER_CONFIG[pathname];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  if (!headerConfig) return null;

  return (
    <header>
      <div className={styles.header}>
        <div className="flex-col">
          <div className="flex">
            <FontAwesomeIcon
              icon={headerConfig.icon}
              className={styles.icon}
            />
            <h2 className={styles.title}>{headerConfig.title}</h2>
          </div>
          <p className={styles.subtitle}>
            {headerConfig.subtitle}
          </p>
        </div>

        {isAuthenticated && (
          <div className="flex">
            <h2 className={styles.title}>Olá, Dra Mirian</h2>
          </div>
        )}
      </div>
    </header>
  );
};