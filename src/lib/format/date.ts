import { format } from "date-fns"

function calendarDate(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function formatDisplayDate(iso: string): string {
  return format(calendarDate(iso), "d MMM yyyy")
}

export function formatMonthTick(iso: string): string {
  return format(calendarDate(iso), "MMM")
}
