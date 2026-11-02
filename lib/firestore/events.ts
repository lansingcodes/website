import { getStore } from '@/lib/store'
import { startOfDay, addWeeks, endOfDay, endOfWeek } from 'date-fns'
import maxCalendarWeeks from '@/config/max-calendar-weeks'
import type { Event } from '@/lib/types'
import { inLansing } from '@/config/time-zone'

export type { Event }

export async function getUpcomingEvents(): Promise<Event[]> {
  const startDate = startOfDay(Date.now(), { in: inLansing })
  const endDate = endOfDay(
    endOfWeek(addWeeks(startDate, maxCalendarWeeks - 1, { in: inLansing }), { in: inLansing }),
    { in: inLansing },
  )

  return getStore().listDocs<Omit<Event, 'id'>>('events', {
    range: { field: 'startTime', min: startDate.getTime(), max: endDate.getTime() },
    orderBy: 'startTime',
  })
}
