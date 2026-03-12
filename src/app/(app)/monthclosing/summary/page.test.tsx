import { render, screen } from "@testing-library/react";
import Summary from "./page";

jest.mock("@/app/(app)/monthclosing/provider/provider", () => ({
  useMonthClosingFlow: jest.fn(),
}));

jest.mock("@/app/(app)/monthclosing/domain/summaryUtils", () => ({
  buildMonthClosingSummary: jest.fn(),
}));

jest.mock("@/app/(app)/monthclosing/summary/block", () => ({
  SummaryBlock: ({ title }: any) => <div>{title}</div>,
}));

jest.mock("@/components/message/message", () => ({
  MessageCard: ({ title }: any) => <div>{title}</div>,
}));

jest.mock("@/utils/utils", () => ({
  formatValueToBRL: (v: number) => `R$ ${v}`,
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const { useMonthClosingFlow } = require("@/app/(app)/monthclosing/provider/provider");
const { buildMonthClosingSummary } = require("@/app/(app)/monthclosing/domain/summaryUtils");

describe("Summary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders message when no report is selected", () => {
    useMonthClosingFlow.mockReturnValue({
      selectedMonthClosing: null,
    });

    render(<Summary />);

    expect(
      screen.getByText(
        "Nenhum relatório de fechamento de caixa foi selecionado."
      )
    ).toBeInTheDocument();
  });

  it("renders summary blocks and balance", () => {
    useMonthClosingFlow.mockReturnValue({
      selectedMonthClosing: { id: 1 },
    });

    buildMonthClosingSummary.mockReturnValue({
      summary: [{ label: "A", value: 1 }],
      inputs: [{ label: "B", value: 2 }],
      outputs: [{ label: "C", value: 3 }],
      totalInputs: 2,
      totalOutputs: 3,
      balance: 10,
    });

    render(<Summary />);

    expect(screen.getByText("Resumo")).toBeInTheDocument();
    expect(screen.getByText("Entradas")).toBeInTheDocument();
    expect(screen.getByText("Saídas")).toBeInTheDocument();
    expect(screen.getByText("SALDO: R$ 10")).toBeInTheDocument();
  });

  it("renders negative balance", () => {
    useMonthClosingFlow.mockReturnValue({
      selectedMonthClosing: { id: 1 },
    });

    buildMonthClosingSummary.mockReturnValue({
      summary: [],
      inputs: [],
      outputs: [],
      totalInputs: 0,
      totalOutputs: 0,
      balance: -50,
    });

    render(<Summary />);

    expect(screen.getByText("SALDO: R$ -50")).toBeInTheDocument();
  });
});