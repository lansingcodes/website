import { getFirestore } from '@/lib/firebase/admin'
import { startOfDay, addWeeks, endOfDay, endOfWeek } from 'date-fns'
import maxCalendarWeeks from '@/config/max-calendar-weeks'
import type { Event } from '@/lib/types'

export type { Event }

export async function getUpcomingEvents(): Promise<Event[]> {
  const db = getFirestore()
  const startDate = startOfDay(Date.now())
  const endDate = endOfDay(endOfWeek(addWeeks(startDate, maxCalendarWeeks - 1)))

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
