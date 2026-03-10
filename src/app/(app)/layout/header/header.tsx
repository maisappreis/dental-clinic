"use client";

import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUserStore } from "@/stores/user.store";
import styles from "./Header.module.css";
import { HEADER_CONFIG } from "@/constants/header";

export function Header() {
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  
  const headerConfig = HEADER_CONFIG[pathname];

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

        {user && (
          <div className="flex">
            <h2 className={styles.title}>
              Olá, {user?.first_name}
            </h2>
          </div>
        )}
      </div>
    </header>
  );
};