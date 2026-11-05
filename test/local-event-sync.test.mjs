import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

function loadSource(source, imports) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  })
  const exports = {}
  vm.runInNewContext(outputText, {
    exports,
    require: (name) => {
      if (name in imports) return imports[name]
      throw new Error(`Unexpected import: ${name}`)
    },
  })
  return exports
}

function deferred() {
  let resolve
  let reject
  const promise = new Promise((done, fail) => { resolve = done; reject = fail })
  return { promise, resolve, reject }
}

test('local sync queues fetching before publishing newer events', async () => {
  const firstFeed = deferred()
  const writes = []
  const store = { replaceCollection: async (_collection, events) => { writes.push(events) } }
  const source = await readFile(new URL('../lib/sync/events.ts', import.meta.url), 'utf8')
  const { syncEvents } = loadSource(source, {
    'node:crypto': { randomUUID: () => 'owner' },
    '@/lib/firebase/admin': { getFirestore: () => { throw new Error('Firestore must not run') } },
    '@/lib/meetup/fetchEventsForAllGroups': { fetchEventsForAllGroups: () => ({}) },
    '@/lib/store': { getStore: () => store },
    '@/lib/store/local': { localStore: store },
  })

  const first = syncEvents(() => firstFeed.promise)
  const second = syncEvents(async () => ({ newer: { name: 'Newer' } }))
  await Promise.resolve()
  assert.equal(writes.length, 0)
  firstFeed.resolve({ older: { name: 'Older' } })
  await Promise.all([first, second])
  assert.deepEqual(writes.map((events) => Object.keys(events)), [['older'], ['newer']])

  await assert.rejects(syncEvents(async () => { throw new Error('Feed failed') }), /Feed failed/)
  await syncEvents(async () => ({ recovered: { name: 'Recovered' } }))
  assert.deepEqual(Object.keys(writes.at(-1)), ['recovered'])
})

test('Meetup client uses a finite request timeout', async () => {
  let config
  const source = await readFile(new URL('../lib/meetup/fetchEventsForGroup.ts', import.meta.url), 'utf8')
  loadSource(source, {
    axios: { create(options) { config = options; return { get: async () => ({ data: '' }) } } },
    './icalToEvents': { icalToEvents: () => ({}) },
  })
  assert.equal(config.baseURL, 'https://www.meetup.com')
  assert.equal(config.timeout, 15_000)
})
