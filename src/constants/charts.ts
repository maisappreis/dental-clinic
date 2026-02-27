import { ChartOptions, TooltipItem } from "chart.js";
import { formatValueToBRL } from "@/utils/utils";

export const barChartOptions = {
  plugins: {
    legend: {
      labels: {
        font: { size: 20 },
        color: "rgba(0, 0, 0, 0.8)",
      },
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

export const lineChartOptions: ChartOptions<"line"> = {
  plugins: {
    legend: {
      labels: {
        font: {
          size: 20,
        },
        color: "rgba(0, 0, 0, 0.8)",
      },
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
    legend: {
      labels: {
        font: {
          size: 20,
        },
        color: "rgba(0, 0, 0, 0.8)",
      },
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
    legend: {
      labels: {
        font: {
          size: 20,
        },
        color: "rgba(0, 0, 0, 0.8)",
      },
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