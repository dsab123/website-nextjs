export const formatDate = (date: string) : string => {
  return date === '' ? '' : new Date(date).toLocaleString('en-us',{month:'long', year:'numeric', day:'numeric'})
}
