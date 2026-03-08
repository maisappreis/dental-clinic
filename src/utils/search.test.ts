import { applySearch } from "./search";

describe("applySearch", () => {
  const data = [
    { name: "João" },
    { name: "Maria" },
    { name: "José" },
    { name: "Ana" },
  ];

  it("returns all data when search is empty", () => {
    const result = applySearch(data, "");

    expect(result).toEqual(data);
  });

  it("filters by single term", () => {
    const result = applySearch(data, "maria");

    expect(result).toEqual([{ name: "Maria" }]);
  });

  it("filters ignoring case", () => {
    const result = applySearch(data, "JOÃO");

    expect(result).toEqual([{ name: "João" }]);
  });

  it("filters by multiple comma separated terms", () => {
    const result = applySearch(data, "joão, ana");

    expect(result).toHaveLength(2);
    expect(result).toEqual([{ name: "João" }, { name: "Ana" }]);
  });

  it("trims spaces between terms", () => {
    const result = applySearch(data, "  maria ,  jose ");

    expect(result).toEqual([{ name: "Maria" }, { name: "José" }]);
  });

  it("returns empty array when no match", () => {
    const result = applySearch(data, "Carlos");

    expect(result).toEqual([]);
  });

  it("ignores empty terms created by extra commas", () => {
    const result = applySearch(data, "joão,,,");

    expect(result).toEqual([{ name: "João" }]);
  });
});