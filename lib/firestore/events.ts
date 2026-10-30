import { getFirestore } from '@/lib/firebase/admin'
import { startOfDay, addWeeks, endOfDay, endOfWeek } from 'date-fns'
import maxCalendarWeeks from '@/config/max-calendar-weeks'
import type { Event } from '@/lib/types'
import { inLansing } from '@/config/time-zone'

export type { Event }

export async function getUpcomingEvents(): Promise<Event[]> {
  const db = getFirestore()
  const startDate = startOfDay(Date.now(), { in: inLansing })
  const endDate = endOfDay(
    endOfWeek(addWeeks(startDate, maxCalendarWeeks - 1, { in: inLansing }), { in: inLansing }),
    { in: inLansing },
  )

  const snapshot = await db
    .collection('events')
    .where('startTime', '>=', startDate.getTime())
    .where('startTime', '<=', endDate.getTime())
    .orderBy('startTime', 'asc')
    .get()

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Event, 'id'>),
  }))
}
