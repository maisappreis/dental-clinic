import {
  getMostPerformedProcedures,
  groupRevenueByMonth,
  groupValuesByMonth,
} from "./charts";

import { Revenue } from "@/types/revenue";

describe("getMostPerformedProcedures", () => {
  const revenue = [
    { procedure: "A" },
    { procedure: "B" },
    { procedure: "A" },
    { procedure: "C" },
    { procedure: "A" },
    { procedure: "B" },
  ] as Revenue[];

  it("returns procedures ordered by most performed", () => {
    const result = getMostPerformedProcedures(revenue);

    expect(result[0]).toEqual(["A", 3]);
    expect(result[1]).toEqual(["B", 2]);
    expect(result[2]).toEqual(["C", 1]);
  });

  it("respects the limit parameter", () => {
    const result = getMostPerformedProcedures(revenue, 2);

    expect(result.length).toBe(2);
    expect(result).toEqual([
      ["A", 3],
      ["B", 2],
    ]);
  });

  it("returns empty array when revenue is empty", () => {
    const result = getMostPerformedProcedures([]);

    expect(result).toEqual([]);
  });
});

describe("groupRevenueByMonth", () => {
  const revenue = [
    { date: "2025-01-01" },
    { date: "2025-01-10" },
    { date: "2025-02-01" },
    { date: "2024-12-20" },
  ] as Revenue[];

  it("groups revenue count by month", () => {
    const result = groupRevenueByMonth(revenue);

    expect(result).toEqual({
      "2025-01": 2,
      "2025-02": 1,
      "2024-12": 1,
    });
  });

  it("returns empty object when revenue is empty", () => {
    const result = groupRevenueByMonth([]);

    expect(result).toEqual({});
  });
});

describe("groupValuesByMonth", () => {
  const items = [
    { date: "2025-01-01", value: 100 },
    { date: "2025-01-10", value: 50 },
    { date: "2025-02-05", value: 200 },
    { date: "2024-12-20", value: 30 },
  ];

  it("groups values by month and sums them", () => {
    const result = groupValuesByMonth(items);

    expect(result).toEqual({
      "2025-01": 150,
      "2025-02": 200,
      "2024-12": 30,
    });
  });

  it("returns empty object when items array is empty", () => {
    const result = groupValuesByMonth([]);

    expect(result).toEqual({});
  });
});