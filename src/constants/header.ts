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
    subtitle: "Encerramento do caixa mensal",
    icon: faBook,
  },
};