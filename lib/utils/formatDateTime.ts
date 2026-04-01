import { format, isSameDay } from 'date-fns'

export function formatReadableDateTime(time: number): string {
  return format(time, "EEEE, MMMM d 'at' h:mm aaa")
}

export function formatTimeOfEvent(startTime: number): string {
  const startMinutes = format(startTime, 'm')
  return format(startTime, startMinutes === '0' ? 'h a' : 'h:mm a')
}

export function formatCalendarDayLabel(day: Date, startDate: Date): string {
  const dayOfMonth = format(day, 'd')
  const isStartDate = isSameDay(day, startDate)
  return dayOfMonth === '1' || isStartDate
    ? format(day, 'MMM d')
    : dayOfMonth
}
