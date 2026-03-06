import {
  faCalendar,
  faChartLine,
  faHandHoldingDollar,
  faMoneyBillTransfer,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

export const HEADER_CONFIG: Record<
  string,
  {
    title: string;
    subtitle: string;
    icon: any;
  }
> = {
  "/calendar/": {
    title: "Agenda",
    subtitle: "Agendamento de consultas e procedimentos",
    icon: faCalendar,
  },
  "/dashboard/": {
    title: "Métricas",
    subtitle: "Visualização gráfica de receita, despesas e lucro",
    icon: faChartLine,
  },
  "/revenue/": {
    title: "Receitas",
    subtitle: "Controle do recebimento das mensalidades dos pacientes",
    icon: faHandHoldingDollar,
  },
  "/expense/": {
    title: "Despesas",
    subtitle: "Controle do pagamento das contas",
    icon: faMoneyBillTransfer,
  },
  "/monthclosing/": {
    title: "Fechamento de caixa",
    subtitle: "Relatórios dos fechamentos de caixa",
    icon: faBook,
  },
  "/monthclosing/reports/": {
    title: "Fechamento de caixa",
    subtitle: "Relatórios dos fechamentos de caixa",
    icon: faBook,
  },
  "/monthclosing/tab1/": {
    title: "Fechamento de caixa",
    subtitle: "Descontando taxas de cartão de crédito e débito",
    icon: faBook,
  },
  "/monthclosing/tab2/": {
    title: "Fechamento de caixa",
    subtitle: "Avaliação dos montantes de entradas e saídas",
    icon: faBook,
  },
  "/monthclosing/summary/": {
    title: "Fechamento de caixa",
    subtitle: "Resumo dos resultados",
    icon: faBook,
  },
};