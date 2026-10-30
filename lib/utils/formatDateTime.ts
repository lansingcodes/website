import { format, isSameDay } from 'date-fns'
import { inLansing } from '@/config/time-zone'

export function formatReadableDateTime(time: number): string {
  return format(time, "EEEE, MMMM d 'at' h:mm aaa", { in: inLansing })
}

export function formatTimeOfEvent(startTime: number): string {
  const startMinutes = format(startTime, 'm', { in: inLansing })
  return format(startTime, startMinutes === '0' ? 'h a' : 'h:mm a', { in: inLansing })
}

export function formatCalendarDayLabel(day: Date, startDate: Date): string {
  const dayOfMonth = format(day, 'd', { in: inLansing })
  const isStartDate = isSameDay(day, startDate, { in: inLansing })
  return dayOfMonth === '1' || isStartDate
    ? format(day, 'MMM d', { in: inLansing })
    : dayOfMonth
}
