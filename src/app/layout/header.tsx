"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCalendar, faHandHoldingDollar, faMoneyBillTransfer, faBook, faRightToBracket, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import styles from "./styles/Header.module.css"
import { useRouter } from 'next/navigation';

export default function Header({ selectedOption }: { selectedOption: string }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdownLogout, setShowDropdownLogout] = useState(false);
  const router = useRouter();
  let title;
  let subtitle;
  let icon;

  switch (selectedOption) {
    case "calendar":
      title = "Agenda";
      subtitle = "Agendamento de consultas e procedimentos";
      icon = <FontAwesomeIcon icon={faCalendar} className={styles.icon} />;
      break;
    case "dashboard":
      title = "Métricas";
      subtitle = "Visualização gráfica de receita, despesas, lucro e procedimentos";
      icon = <FontAwesomeIcon icon={faChartLine} className={styles.icon} />;
      break;
    case "revenue":
      title = "Receitas";
      subtitle = "Controle do recebimento das mensalidades dos pacientes";
      icon = <FontAwesomeIcon icon={faHandHoldingDollar} className={styles.icon} />;
      break;
    case "expense":
      title = "Despesas";
      subtitle = "Controle do pagamento das contas";
      icon = <FontAwesomeIcon icon={faMoneyBillTransfer} className={styles.icon} />;
      break;
    case "monthClosing":
      title = "Fechamento de caixa";
      subtitle = "Encerramento do caixa mensal";
      icon = <FontAwesomeIcon icon={faBook} className={styles.icon} />;
      break;

    default:
      title = null;
      subtitle = null;
      icon = null;
  }

  const handleLogout = () => {
    setShowDropdownLogout(!showDropdownLogout);
  }

  const loginUser = () => {
    router.push('/login');
  }

  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload();
  }

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) setIsAuthenticated(true);
  }, []);

  return (
    <div className={styles.hearder}>
      <div className={styles.text}>
        <div className={styles.heading}>
          <div className="flex">
            {icon}
            <h2 className={styles.title}>{title}</h2>
          </div>
          <p className={styles.subtitle}>
            {subtitle}
          </p>
        </div>
        {isAuthenticated ?
          <div className={`${styles.user} cursor-pointer`} onClick={handleLogout}>
            <h2 className="font-bold text-xl">Olá, Dra Mirian</h2>
            <FontAwesomeIcon icon={faCircleUser} className="ml-3" style={{ zoom: 1.4 }} />
          </div> :
          <FontAwesomeIcon icon={faRightToBracket} className={styles.login} onClick={loginUser} />
        }
      </div>
      {showDropdownLogout && (
        <button className={styles.dropdown} onClick={logoutUser}>
          <FontAwesomeIcon icon={faRightToBracket} className={styles.logout} />
          Logout
        </button>
      )}
    </div>
  )
}