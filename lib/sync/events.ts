import { getFirestore } from '@/lib/firebase/admin'
import { fetchEventsForAllGroups } from '@/lib/meetup/fetchEventsForAllGroups'

// Full-replace sync: fetch all current Meetup events, write them to
// Firestore, then delete any docs that weren't in the new set. Writing
// before deleting avoids a window where events are missing from the site.
export async function syncEvents() {
  const db = getFirestore()
  const eventsRef = db.collection('events')

  // Fetch new events first, before any deletions
  const events = await fetchEventsForAllGroups()
  const newEventIds = new Set(Object.keys(events))

  // Write new events
  await Promise.all(
    Object.entries(events).map(([id, event]) =>
      eventsRef.doc(id).set(event as Record<string, unknown>),
    ),
  )

  // Delete stale events that weren't in the new fetch
  const existingDocs = await eventsRef.listDocuments()
  const staleDocs = existingDocs.filter((doc) => !newEventIds.has(doc.id))
  await Promise.all(staleDocs.map((doc) => doc.delete()))
}
