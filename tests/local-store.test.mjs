import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const loadModule = createRequire(import.meta.url)
const source = await fs.readFile(new URL('../lib/store/local.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
})

function deferred() {
  let resolve
  const promise = new Promise((done) => { resolve = done })
  return { promise, resolve }
}

async function createStore(t, overrides = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lansing-store-test-'))
  const dataDir = path.join(root, '.data')
  await fs.mkdir(dataDir)
  t.after(async () => {
    for (const name of await fs.readdir(dataDir)) {
      await fs.unlink(path.join(dataDir, name))
    }
    await fs.rmdir(dataDir)
    await fs.rmdir(root)
  })

  // Filesystem hooks control interleaving and failures while keeping real file I/O.
  const filesystem = { ...fs }
  for (const [operation, beforeOperation] of Object.entries(overrides)) {
    filesystem[operation] = async (...args) => {
      await beforeOperation(...args)
      return fs[operation](...args)
    }
  }

  // Load the actual store without changing the test process's working directory.
  const exports = {}
  vm.runInNewContext(outputText, {
    exports,
    process: { cwd: () => root },
    require: (name) => name === 'node:fs/promises' ? filesystem : loadModule(name),
  }, { filename: 'local-store.js' })

  return {
    store: exports.localStore,
    dataDir,
    readSnapshot: async (collection) => JSON.parse(
      await fs.readFile(path.join(dataDir, `${collection}.json`), 'utf8'),
    ),
  }
}

test('same-collection replacements queue while other collections can publish', { timeout: 5000 }, async (t) => {
  const staged = deferred()
  const release = deferred()
  const published = []
  const { store, dataDir, readSnapshot } = await createStore(t, {
    async rename(source, destination) {
      if (path.basename(destination) !== 'events.json') return
      published.push(JSON.parse(await fs.readFile(source, 'utf8')))
      if (published.length === 1) {
        staged.resolve()
        await release.promise
      }
    },
  })
  const snapshots = [
    { large: { name: 'A'.repeat(200_000) } },
    { small: { name: 'B' } },
  ]

  const first = store.replaceCollection('events', snapshots[0])
  await staged.promise
  const second = store.replaceCollection('events', snapshots[1])
  // Observe failures immediately, even while the first writer is paused.
  const replacements = Promise.allSettled([first, second])
  const groups = { group: { name: 'Group' } }
  try {
    await store.replaceCollection('groups', groups)
    assert.deepEqual(await readSnapshot('groups'), groups)
    assert.equal(published.length, 1)
    assert.equal((await fs.readdir(dataDir)).filter((name) => name.startsWith('events.json.')).length, 1)
  } finally {
    release.resolve()
    await replacements
  }
  const results = await replacements
  for (const result of results) {
    assert.equal(result.status, 'fulfilled', result.reason?.stack)
  }
  assert.deepEqual(published, snapshots)
  assert.deepEqual(await readSnapshot('events'), snapshots[1])
  assert.deepEqual((await fs.readdir(dataDir)).sort(), ['events.json', 'groups.json'])
})

test('readers see the old snapshot until a replacement is published', async (t) => {
  const staged = deferred()
  const release = deferred()
  let pauseRenames = false
  const { store, dataDir } = await createStore(t, {
    async rename() {
      if (pauseRenames) {
        staged.resolve()
        await release.promise
      }
    },
  })
  await store.replaceCollection('events', { old: { name: 'Old' } })
  pauseRenames = true

  const replacement = store.replaceCollection('events', { new: { name: 'New' } })
  try {
    await staged.promise
    assert.deepEqual(Array.from(await store.listDocs('events'), (doc) => ({ ...doc })), [
      { id: 'old', name: 'Old' },
    ])
  } finally {
    release.resolve()
    await replacement
  }
  assert.deepEqual(Array.from(await store.listDocs('events'), (doc) => ({ ...doc })), [
    { id: 'new', name: 'New' },
  ])
  assert.deepEqual(await fs.readdir(dataDir), ['events.json'])
})

test('many overlapping replacements leave one complete snapshot and no temporary files', async (t) => {
  const { store, dataDir, readSnapshot } = await createStore(t)
  const snapshots = Array.from({ length: 30 }, (_, index) => ({
    event: { name: String(index).repeat(10_000), startTime: index },
  }))
  await Promise.all(snapshots.map((snapshot) => store.replaceCollection('events', snapshot)))
  assert.deepEqual(await readSnapshot('events'), snapshots.at(-1))
  assert.deepEqual(await fs.readdir(dataDir), ['events.json'])
})

test('a failed replacement lets the next queued replacement publish', { timeout: 5000 }, async (t) => {
  const staged = deferred()
  const release = deferred()
  const failure = new Error('Injected rename failure')
  let failNext = false
  const { store, dataDir, readSnapshot } = await createStore(t, {
    async rename() {
      if (!failNext) return
      failNext = false
      staged.resolve()
      await release.promise
      throw failure
    },
  })
  await store.replaceCollection('events', { old: { name: 'Old' } })
  failNext = true
  const rejected = assert.rejects(
    store.replaceCollection('events', { failed: { name: 'Failed' } }),
    (error) => error === failure,
  )
  await staged.promise
  const latest = { latest: { name: 'Latest' } }
  const queued = store.replaceCollection('events', latest)
  release.resolve()
  await Promise.all([rejected, queued])
  assert.deepEqual(await readSnapshot('events'), latest)
  assert.deepEqual(await fs.readdir(dataDir), ['events.json'])
})

for (const operation of ['writeFile', 'rename']) {
  test(`${operation} failures preserve existing data and clean up temporary files`, async (t) => {
    const failure = new Error(`Injected ${operation} failure`)
    let shouldFail = false
    const { store, dataDir, readSnapshot } = await createStore(t, {
      async [operation](...args) {
        if (shouldFail) {
          if (operation === 'writeFile') await fs.writeFile(args[0], 'partial JSON')
          throw failure
        }
      },
    })
    const original = { old: { name: 'Old' } }
    await store.replaceCollection('events', original)
    shouldFail = true

    await assert.rejects(
      store.replaceCollection('events', { new: { name: 'New' } }),
      (error) => error === failure,
    )
    assert.deepEqual(await readSnapshot('events'), original)
    assert.deepEqual(await fs.readdir(dataDir), ['events.json'])
  })
}

test('cleanup failures do not mask the original replacement error', async (t) => {
  const failure = new Error('Injected rename failure')
  let shouldFail = false
  const { store, readSnapshot } = await createStore(t, {
    async rename() {
      if (shouldFail) throw failure
    },
    async rm() {
      if (shouldFail) throw new Error('Injected cleanup failure')
    },
  })
  const original = { old: { name: 'Old' } }
  await store.replaceCollection('events', original)
  shouldFail = true

  await assert.rejects(
    store.replaceCollection('events', { new: { name: 'New' } }),
    (error) => error === failure,
  )
  assert.deepEqual(await readSnapshot('events'), original)
})

test('parallel replacements of different collections retain both snapshots', async (t) => {
  const { store, dataDir, readSnapshot } = await createStore(t)
  const groups = { group: { name: 'Group' } }
  const sponsors = { sponsor: { name: 'Sponsor' } }

  await Promise.all([
    store.replaceCollection('groups', groups),
    store.replaceCollection('sponsors', sponsors),
  ])

  assert.deepEqual(await readSnapshot('groups'), groups)
  assert.deepEqual(await readSnapshot('sponsors'), sponsors)
  assert.deepEqual((await fs.readdir(dataDir)).sort(), ['groups.json', 'sponsors.json'])
})
