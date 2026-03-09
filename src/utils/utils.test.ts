import {
  capitalizeFirstLetter,
  prepareDataForSubmission,
  formatValueToBRL,
  formatCPF,
} from "./utils";

import { ExpenseFormData } from "@/types/expense";

jest.mock("@/utils/date", () => ({
  getMonthAndYear: () => ["Janeiro", "2025"],
}));

describe("capitalizeFirstLetter", () => {
  it("capitalizes first letters correctly", () => {
    const result = capitalizeFirstLetter("conta de luz");

    expect(result).toBe("Conta de Luz");
  });

  it("keeps lowercase connector words", () => {
    const result = capitalizeFirstLetter("casa da moeda");

    expect(result).toBe("Casa da Moeda");
  });

  it("trims spaces and normalizes case", () => {
    const result = capitalizeFirstLetter("   CARTAO   DE   CREDITO ");

    expect(result).toBe("Cartao de Credito");
  });

  it("returns empty string when input empty", () => {
    const result = capitalizeFirstLetter("");

    expect(result).toBe("");
  });
});

describe("prepareDataForSubmission", () => {
  const baseData = {
    name: "conta de luz",
    value: 100,
  } as ExpenseFormData;

  it("adds month and year when date exists", () => {
    const result = prepareDataForSubmission({
      ...baseData,
      date: "2025-01-10",
    });

    expect(result.month).toBe("Janeiro");
    expect(result.year).toBe(2025);
    expect(result.name).toBe("Conta de Luz");
  });

  it("only formats name when date does not exist", () => {
    const result = prepareDataForSubmission(baseData);

    expect(result.name).toBe("Conta de Luz");
    expect(result.month).toBeUndefined();
  });
});

describe("formatValueToBRL", () => {
  it("formats number to BRL currency", () => {
    const result = formatValueToBRL(1000);

    expect(result).toContain("1.000");
  });

  it("returns empty string for NaN", () => {
    const result = formatValueToBRL(NaN);

    expect(result).toBe("");
  });

  it("returns empty string for invalid type", () => {
    const result = formatValueToBRL(undefined as unknown as number);

    expect(result).toBe("");
  });
});

describe("formatCPF", () => {
  it("formats CPF correctly", () => {
    const result = formatCPF("12345678901");

    expect(result).toBe("123.456.789-01");
  });

  it("removes non-numeric characters", () => {
    const result = formatCPF("123.456.789-01");

    expect(result).toBe("123.456.789-01");
  });

  it("limits CPF to 11 digits", () => {
    const result = formatCPF("123456789012345");

    expect(result).toBe("123.456.789-01");
  });

  it("returns empty string when input empty", () => {
    const result = formatCPF("");

    expect(result).toBe("");
  });
});