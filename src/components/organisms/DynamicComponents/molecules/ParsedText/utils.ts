export const formatLocalDate = (iso: string): string => {
  const date = new Date(iso)
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // set to true for 12-hour clock with AM/PM
    // timeZoneName: 'short', // e.g. “CEST”
  })
}
