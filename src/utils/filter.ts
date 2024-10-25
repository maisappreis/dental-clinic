
// Allows you to search for multiple terms separated by commas
export function applySearch(data: any[], search: string): any[] {
  const searchedList = search.split(",").map(value => value.trim())

  const filterData = data.filter(item => {
    return searchedList.some(element => {
      const searchedFieldName = element.toLowerCase();
      const listedFieldName = item.name.toLowerCase();
      return listedFieldName.includes(searchedFieldName);
    });
  });
  return filterData
}