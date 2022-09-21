const monthLookup = new Map([
  ['1', 'January'],
  ['2', 'February'],
  ['3', 'March'],
  ['4', 'April'],
  ['5', 'May'],
  ['6', 'June'],
  ['7', 'July'],
  ['8', 'August'],
  ['9', 'September'],
  ['10', 'October'],
  ['11', 'November'],
  ['12', 'December']
])

export const makeDateFriendly = (date: string) : string => {
  const arr = date.split('-');

  const month = arr[0];
  const newMonth = monthLookup.get(month);

  return `${newMonth} ${arr[1]}, ${arr[2]}`;
}
