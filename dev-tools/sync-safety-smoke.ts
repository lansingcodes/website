import assert from 'node:assert/strict'
import { deleteApp } from 'firebase-admin/app'
import { getFirebaseAdmin, getFirestore } from '../lib/firebase/admin'
import { EventSyncInProgressError, syncEvents } from '../lib/sync/events'
import { runAllSyncs } from '../lib/sync/all'
import { syncGroups } from '../lib/sync/groups'
import { syncSponsors } from '../lib/sync/sponsors'
import groups from '../data/groups.json'
import sponsors from '../data/sponsors.json'

if (!['127.0.0.1:8085', 'localhost:8085'].includes(process.env.FIRESTORE_EMULATOR_HOST || '') ||
    process.env.FIREBASE_PROJECT_ID !== 'demo-lansingcodes') {
  throw new Error('The sync smoke test requires the local demo-lansingcodes Firestore emulator')
}

async function main () {
  const db = getFirestore()
  const eventsRef = db.collection('events')
  const existing = eventsRef.doc('existing-event')
  const replacement = eventsRef.doc('replacement-event')
  const groupsRef = db.collection('groups')
  const sponsorsRef = db.collection('sponsors')

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

    let signalFirstStarted!: () => void
    let resumeFirst!: () => void
    const firstStarted = new Promise<void>((resolve) => { signalFirstStarted = resolve })
    const firstPaused = new Promise<void>((resolve) => { resumeFirst = resolve })
    const firstRun = syncEvents(async () => {
      signalFirstStarted()
      await firstPaused
      return { 'older-event': { group: 'devops', name: 'Older event', startTime: Date.now() } }
    })
    await firstStarted

    let overlappingFeedLoaded = false
    await assert.rejects(syncEvents(async () => {
      overlappingFeedLoaded = true
      return {}
    }), EventSyncInProgressError)
    assert.equal(overlappingFeedLoaded, false)
    console.log('PASS: a second sync cannot start while the lease is active')

    // Simulate a crashed or stalled first process whose lease has expired.
    await db.collection('_sync_locks').doc('events').update({ expiresAt: 0 })
    await syncEvents(async () => ({
      'newer-event': { group: 'devops', name: 'Newer event', startTime: Date.now() },
    }))
    resumeFirst()
    await assert.rejects(firstRun, /lease was lost/)
    assert.equal((await eventsRef.doc('newer-event').get()).exists, true)
    assert.equal((await eventsRef.doc('older-event').get()).exists, false)
    console.log('PASS: an expired older run cannot replace a newer successful sync')

    await groupsRef.doc('old-group').set({ name: 'Old group' })
    await sponsorsRef.doc('old-sponsor').set({ name: 'Old sponsor' })
    const combined = await runAllSyncs({
      events: () => syncEvents(async () => { throw new Error('Meetup unavailable') }),
      groups: syncGroups,
      sponsors: syncSponsors,
    })
    assert.deepEqual(combined.outcomes, {
      events: 'failed_or_partial', groups: 'complete', sponsors: 'complete',
    })
    assert.equal((await eventsRef.doc('newer-event').get()).exists, true)
    assert.equal((await groupsRef.doc('old-group').get()).exists, false)
    assert.equal((await sponsorsRef.doc('old-sponsor').get()).exists, false)
    assert.equal((await groupsRef.doc(Object.keys(groups)[0]).get()).exists, true)
    assert.equal((await sponsorsRef.doc(Object.keys(sponsors)[0]).get()).exists, true)
    console.log('PASS: failed combined sync waits for writers and identifies changed collections')
  } finally {
    await db.recursiveDelete(eventsRef)
    await db.recursiveDelete(groupsRef)
    await db.recursiveDelete(sponsorsRef)
    await db.recursiveDelete(db.collection('_sync_locks'))
    await db.terminate()
    await deleteApp(getFirebaseAdmin())
  }
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
