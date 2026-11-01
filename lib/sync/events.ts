import { getStore } from '@/lib/store'
import type { StoredDoc } from '@/lib/store/types'
import { fetchEventsForAllGroups } from '@/lib/meetup/fetchEventsForAllGroups'

export { EventSyncInProgressError } from '@/lib/store/firestore'

// The selected store protects the full fetch-and-replace operation.
export async function syncEvents(
  loadEvents: typeof fetchEventsForAllGroups = fetchEventsForAllGroups,
) {
  await getStore().syncEvents(
    async () => loadEvents() as Promise<Record<string, StoredDoc>>,
  )
}
