import { orderRevenue, calculateNetRevenue } from "./tab1Utils";
import { Revenue } from "@/types/revenue";

describe("orderRevenue", () => {
  const revenue: Revenue[] = [
    {
      payment: "Pix",
      release_date: "2024-03-10",
      value: 100,
    },
    {
      payment: "Débito",
      release_date: "2024-03-05",
      value: 200,
    },
    {
      payment: "Crédito à vista",
      release_date: "2024-03-01",
      value: 300,
    },
    {
      payment: "Crédito à prazo",
      release_date: "2024-03-03",
      value: 400,
    },
  ] as Revenue[];

  it("orders priority payments by release date first", () => {
    const result = orderRevenue(revenue);

    expect(result[0].payment).toBe("Crédito à vista");
    expect(result[1].payment).toBe("Crédito à prazo");
    expect(result[2].payment).toBe("Débito");
    expect(result[3].payment).toBe("Pix");
  });
});

describe("calculateNetRevenue", () => {
  const revenue: Revenue[] = [
    { payment: "Débito", value: 100 },
    { payment: "Crédito à vista", value: 200 },
    { payment: "Crédito à prazo", value: 300 },
    { payment: "Pix", value: 400 },
  ] as Revenue[];

  const rates = {
    debit: 2,
    cashCredit: 3,
    installmentCredit: 4,
  };

  it("calculates net revenue applying correct rates", () => {
    const result = calculateNetRevenue(revenue, rates);

    expect(result[0].net_value).toBe(98);  // 100 - 2%
    expect(result[1].net_value).toBe(194); // 200 - 3%
    expect(result[2].net_value).toBe(288); // 300 - 4%
    expect(result[3].net_value).toBe(400); // sem taxa
  });
});