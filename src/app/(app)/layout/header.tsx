"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/Header.module.css";
import { HEADER_CONFIG } from "@/constants/header";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdownLogout, setShowDropdownLogout] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  console.log('pathname', pathname)

  const headerConfig = HEADER_CONFIG[pathname];

  const handleLogoutToggle = () => {
    setShowDropdownLogout((prev) => !prev);
  };

  const loginUser = () => {
    router.push("/login");
  };

  const logoutUser = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  if (!headerConfig) return null;

  return (
    <div className={styles.hearder}>
      <div className={styles.text}>
        <div className={styles.heading}>
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

        {isAuthenticated ? (
          <div
            className={`${styles.user} cursor-pointer`}
            onClick={handleLogoutToggle}
          >
            <h2 className="font-bold text-xl">Olá, Dra Mirian</h2>
            <FontAwesomeIcon
              icon={faCircleUser}
              className="ml-3"
              style={{ zoom: 1.4 }}
            />
          </div>
        ) : (
          <FontAwesomeIcon
            icon={faRightToBracket}
            className={styles.login}
            onClick={loginUser}
          />
        )}
      </div>

      {showDropdownLogout && (
        <button className={styles.dropdown} onClick={logoutUser}>
          <FontAwesomeIcon
            icon={faRightToBracket}
            className={styles.logout}
          />
          Logout
        </button>
      )}
    </div>
  );
};