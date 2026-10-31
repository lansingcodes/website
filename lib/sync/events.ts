import { getStore } from '@/lib/store'
import type { StoredDoc } from '@/lib/store/types'
import { fetchEventsForAllGroups } from '@/lib/meetup/fetchEventsForAllGroups'

// Full-replace sync: fetch all current Meetup events and replace the
// events collection (stale events are removed).
export async function syncEvents() {
  const events = await fetchEventsForAllGroups()
  await getStore().replaceCollection('events', events as Record<string, StoredDoc>)
}
