import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCalendar, faHandHoldingDollar, faMoneyBillTransfer, faBook } from '@fortawesome/free-solid-svg-icons';
import styles from "./styles/Header.module.css"

// export default function Header() {
export default function Header({ selectedOption }: { selectedOption: string }) {
  let title;
  let subtitle;
  let icon;

  switch (selectedOption) {
    case "calendar":
      title = "Agenda";
      subtitle = "Agendamento de consultas e procedimentos";
      icon = <FontAwesomeIcon icon={faCalendar} className={styles.icon}/>;
      break;
    case "dashboard":
      title = "Métricas";
      subtitle = "Visualização gráfica de receita, despesas, lucro e procedimentos";
      icon = <FontAwesomeIcon icon={faChartLine} className={styles.icon} />;
      break;
    case "revenue":
      title = "Receitas";
      subtitle = "Controle do recebimento das mensalidades dos pacientes";
      icon = <FontAwesomeIcon icon={faHandHoldingDollar} className={styles.icon}/>;
      break;
    case "expense":
      title = "Despesas";
      subtitle = "Controle do pagamento das contas";
      icon = <FontAwesomeIcon icon={faMoneyBillTransfer} className={styles.icon}/>;
      break;
    case "monthEndClosing":
      title = "Fechamento de caixa";
      subtitle = "Encerramento do caixa mensal";
      icon = <FontAwesomeIcon icon={faBook} className={styles.icon}/>;
      break;

    default:
      title = null;
      subtitle = null;
      icon = null;
  }

  return (
    <div className={styles.hearder}>
      <div className={styles.text}>
        <div className="flex">
          {icon}
          <h2 className={styles.title}>{ title }</h2>
        </div>
        <p className={styles.subtitle}>
          { subtitle}
        </p>
      </div>
    </div>
  )
}