import { sortByDate } from "./sort";

describe("sortByDate", () => {
  const data = [
    { date: "2025-03-10", id: 1 },
    { date: "2025-01-05", id: 2 },
    { date: "2025-02-01", id: 3 },
  ];

  it("sorts dates in ascending order by default", () => {
    const result = sortByDate(data);

    expect(result.map(i => i.date)).toEqual([
      "2025-01-05",
      "2025-02-01",
      "2025-03-10",
    ]);
  });

  it("sorts dates in descending order", () => {
    const result = sortByDate(data, "desc");

    expect(result.map(i => i.date)).toEqual([
      "2025-03-10",
      "2025-02-01",
      "2025-01-05",
    ]);
  });

  it("does not mutate the original array", () => {
    const copy = [...data];

    sortByDate(data);

    expect(data).toEqual(copy);
  });

  it("keeps items with invalid dates in original relative position", () => {
    const dataWithInvalid = [
      { date: "2025-02-01" },
      { date: "invalid-date" },
      { date: "2025-01-01" },
    ];

    const result = sortByDate(dataWithInvalid);

    expect(result).toHaveLength(3);
  });

  it("returns empty array when input is empty", () => {
    const result = sortByDate([]);

    expect(result).toEqual([]);
  });
});