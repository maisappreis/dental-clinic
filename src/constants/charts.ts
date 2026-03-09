import { ChartOptions, TooltipItem } from "chart.js";
import { formatValueToBRL } from "@/utils/utils";

export const proceduresBarChartOptions = {
  plugins: {
    title: {
      display: true,
      text: "Procedimentos mais realizados",
      font: {
        size: 18,
        weight: "bold" as const,
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    legend: {
      display: false,
    },
    tooltip: {
      titleFont: { size: 18 },
      bodyFont: { size: 16 },
      padding: 10,
      boxPadding: 8,
      callbacks: {
        label(tooltipItem: TooltipItem<"bar">) {
          return tooltipItem.parsed.y !== null
            ? `${tooltipItem.raw} realizados`
            : "";
        },
      },
    },
  },
};

export const proceduresLineChartOptions: ChartOptions<"line"> = {
  plugins: {
    title: {
      display: true,
      text: "Número de procedimentos realizados",
      font: {
        size: 18,
        weight: "bold" as const,
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    legend: {
      display: false,
    },
    tooltip: {
      titleFont: {
        size: 18,
      },
      bodyFont: {
        size: 16,
      },
      padding: 10,
      boxPadding: 8,
      callbacks: {
        label(tooltipItem: TooltipItem<"line">) {
          return tooltipItem.parsed.y !== null
            ? `${tooltipItem.raw} realizados`
            : "";
        },
      },
    },
  },
};

export const profitBarChartOptions: ChartOptions<"bar"> = {
  plugins: {
    title: {
      display: true,
      text: "Lucro Bruto Mensal",
      font: {
        size: 18,
        weight: "bold" as const,
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    legend: {
      display: false,
    },
    tooltip: {
      titleFont: {
        size: 18,
      },
      bodyFont: {
        size: 16,
      },
      padding: 10,
      boxPadding: 8,
      callbacks: {
        label(tooltipItem: TooltipItem<"bar">) {
          return tooltipItem.parsed.y !== null
            ? formatValueToBRL(Number(tooltipItem.raw))
            : "";
        },
      },
    },
  },
};

export const revenueExpensesLineChartOptions: ChartOptions<"line"> = {
  plugins: {
    title: {
      display: true,
      text: "Receita x Despesas",
      font: {
        size: 18,
        weight: "bold" as const,
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    legend: {
      display: false,
    },
    tooltip: {
      titleFont: {
        size: 18,
      },
      bodyFont: {
        size: 16,
      },
      padding: 10,
      boxPadding: 8,
      callbacks: {
        label(tooltipItem: TooltipItem<"line">) {
          return tooltipItem.parsed.y !== null
            ? formatValueToBRL(Number(tooltipItem.raw))
            : "";
        },
      },
    },
  },
};