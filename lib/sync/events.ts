import { randomUUID } from 'node:crypto'
import { getFirestore } from '@/lib/firebase/admin'
import { fetchEventsForAllGroups } from '@/lib/meetup/fetchEventsForAllGroups'

const LEASE_MS = 10 * 60 * 1000
const WRITES_PER_TRANSACTION = 200

export class EventSyncInProgressError extends Error {
  constructor() {
    super('An event sync is already running')
    this.name = 'EventSyncInProgressError'
  }
}

// A Firestore lease coordinates scheduled and manual syncs across instances.
// Every write transaction also checks ownership, so a process that outlives
// its lease cannot overwrite a newer run's events.
export async function syncEvents(loadEvents: typeof fetchEventsForAllGroups = fetchEventsForAllGroups) {
  const db = getFirestore()
  const lockRef = db.collection('_sync_locks').doc('events')
  const owner = randomUUID()

  await db.runTransaction(async (transaction) => {
    const lock = await transaction.get(lockRef)
    if (lock.exists && Number(lock.get('expiresAt')) > Date.now()) {
      throw new EventSyncInProgressError()
    }
    transaction.set(lockRef, { owner, expiresAt: Date.now() + LEASE_MS })
  })

  let syncError: unknown
  try {
    // Fetch every feed before replacing any event documents.
    const events = await loadEvents()
    const eventsRef = db.collection('events')
    const newEventIds = new Set(Object.keys(events))
    const existingDocs = await eventsRef.listDocuments()
    const staleDocs = existingDocs.filter((doc) => !newEventIds.has(doc.id))
    const operations = [
      ...Object.entries(events).map(([id, event]) => ({
        kind: 'set' as const,
        ref: eventsRef.doc(id),
        value: event as Record<string, unknown>,
      })),
      ...staleDocs.map((ref) => ({ kind: 'delete' as const, ref })),
    ]

    for (let start = 0; start < operations.length; start += WRITES_PER_TRANSACTION) {
      const chunk = operations.slice(start, start + WRITES_PER_TRANSACTION)
      await db.runTransaction(async (transaction) => {
        const lock = await transaction.get(lockRef)
        if (lock.get('owner') !== owner || Number(lock.get('expiresAt')) <= Date.now()) {
          throw new Error('Event sync lease was lost before applying changes')
        }
        transaction.update(lockRef, { expiresAt: Date.now() + LEASE_MS })
        for (const operation of chunk) {
          if (operation.kind === 'set') transaction.set(operation.ref, operation.value)
          else transaction.delete(operation.ref)
        }
      })
    }
  } catch (error) {
    syncError = error
    throw error
  } finally {
    try {
      await db.runTransaction(async (transaction) => {
        const lock = await transaction.get(lockRef)
        if (lock.get('owner') === owner) transaction.delete(lockRef)
      })
    } catch (error) {
      if (!syncError) throw error
      console.error('Failed to release event sync lease:', error)
    }
  }
}
