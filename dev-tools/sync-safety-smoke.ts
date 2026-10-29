import assert from 'node:assert/strict'
import { deleteApp } from 'firebase-admin/app'
import { getFirebaseAdmin, getFirestore } from '../lib/firebase/admin'
import { syncEvents } from '../lib/sync/events'

if (!['127.0.0.1:8085', 'localhost:8085'].includes(process.env.FIRESTORE_EMULATOR_HOST || '') ||
    process.env.FIREBASE_PROJECT_ID !== 'demo-lansingcodes') {
  throw new Error('The sync smoke test requires the local demo-lansingcodes Firestore emulator')
}

async function main () {
  const db = getFirestore()
  const eventsRef = db.collection('events')
  const existing = eventsRef.doc('existing-event')
  const replacement = eventsRef.doc('replacement-event')

  try {
    await existing.set({ group: 'devops', name: 'Existing event', startTime: Date.now() })

    await assert.rejects(syncEvents(async () => {
      throw new Error('Meetup feed unavailable')
    }), /Meetup feed unavailable/)
    assert.equal((await existing.get()).exists, true)
    console.log('PASS: failed feed preserves the existing Firestore event')

    await syncEvents(async () => ({
      'replacement-event': { group: 'devops', name: 'Replacement event', startTime: Date.now() }
    }))
    assert.equal((await existing.get()).exists, false)
    assert.equal((await replacement.get()).exists, true)
    console.log('PASS: complete feed replaces stale events')
  } finally {
    await db.recursiveDelete(eventsRef)
    await db.terminate()
    await deleteApp(getFirebaseAdmin())
  }
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
