import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import * as fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import test from 'node:test'
import { deleteApp, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import ts from 'typescript'

const loadModule = createRequire(import.meta.url)
const source = await fs.readFile(new URL('../lib/store/firestore.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
})

function deferred() {
  let resolve
  const promise = new Promise((done) => { resolve = done })
  return { promise, resolve }
}

test('Firestore event sync preserves failed feeds and rejects overlapping or stale writers', {
  skip: !process.env.FIRESTORE_EMULATOR_HOST && 'Requires a Firestore emulator',
  timeout: 15000,
}, async () => {
  const host = process.env.FIRESTORE_EMULATOR_HOST
  assert.match(host, /^(127\.0\.0\.1|localhost):\d+$/)
  // A distinct demo project keeps this test separate from other emulator users.
  const app = initializeApp({ projectId: 'demo-codex-sync-safety' }, `sync-safety-${randomUUID()}`)
  const db = getFirestore(app)
  db.settings({ host, ssl: false })
  const exports = {}
  // Run in this realm: Firestore checks that transaction callbacks return
  // a native Promise, and promises from a separate vm context fail that check.
  const evaluateModule = new Function('exports', 'require', outputText)
  evaluateModule(exports, (name) => name === '@/lib/firebase/admin'
      ? { getFirestore: () => db }
      : loadModule(name))
  const store = exports.firestoreStore
  const eventsRef = db.collection('events')
  const lockRef = db.collection('_sync_locks').doc('events')

  try {
    await eventsRef.doc('old').set({ name: 'Old event' })
    await assert.rejects(
      store.syncEvents(async () => { throw new Error('Meetup unavailable') }),
      /Meetup unavailable/,
    )
    assert.equal((await eventsRef.doc('old').get()).get('name'), 'Old event')
    assert.equal((await lockRef.get()).exists, false)

    const started = deferred()
    const release = deferred()
    const older = store.syncEvents(async () => {
      started.resolve()
      await release.promise
      return { stale: { name: 'Stale event' } }
    })
    await started.promise
    try {
      await assert.rejects(store.syncEvents(async () => ({})), /already running/)
      // Simulate a lost lease, then let a newer writer publish.
      await lockRef.update({ expiresAt: Date.now() - 1 })
      await store.syncEvents(async () => ({ latest: { name: 'Latest event' } }))
    } finally {
      release.resolve()
    }
    await assert.rejects(older, /lease was lost/)
    const snapshot = await eventsRef.get()
    assert.deepEqual(snapshot.docs.map((doc) => doc.id), ['latest'])
    assert.equal((await lockRef.get()).exists, false)
  } finally {
    const docs = await eventsRef.listDocuments()
    await Promise.all(docs.map((doc) => doc.delete()))
    await lockRef.delete()
    await deleteApp(app)
  }
})
