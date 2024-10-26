import { applySearch } from "@/utils/filter";

describe('Filter Utils Functions', () => {
  const data = [
    { name: 'Alice' },
    { name: 'Bob' },
    { name: 'Charlie' },
    { name: 'Daniel' },
    { name: 'Alicia' }
  ];

  it('should return an empty array if no data matches the search term', () => {
    const result = applySearch(data, 'Zara');
    expect(result).toEqual([]);
  });

  it('should return items that match a single search term', () => {
    const result = applySearch(data, 'Alice');
    expect(result).toEqual([{ name: 'Alice' }]);
  });

  it('should return items that match multiple search terms', () => {
    const result = applySearch(data, 'Alice, Bob');
    expect(result).toEqual([{ name: 'Alice' }, { name: 'Bob' }]);
  });

  it('should return items that match search terms with spaces around commas', () => {
    const result = applySearch(data, 'Alice,  Bob , Charlie ');
    expect(result).toEqual([{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]);
  });

  it('should be case-insensitive when searching', () => {
    const result = applySearch(data, 'alice, CHARLIE');
    expect(result).toEqual([{ name: 'Alice' }, { name: 'Charlie' }]);
  });

  it('should return multiple items when a search term matches multiple entries', () => {
    const result = applySearch(data, 'Ali');
    expect(result).toEqual([{ name: 'Alice' }, { name: 'Alicia' }]);
  });
});
