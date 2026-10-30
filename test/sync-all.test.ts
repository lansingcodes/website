import test from 'node:test'
import assert from 'node:assert/strict'
import { runAllSyncs } from '../lib/sync/all'

test('combined sync waits for all writers and reports every outcome', async () => {
  let finishGroups!: () => void
  let finished = false
  const groups = new Promise<void>((resolve) => { finishGroups = resolve })
  const running = runAllSyncs({
    events: async () => { throw new Error('Meetup unavailable') },
    groups: () => groups,
    sponsors: async () => {},
  }).then((result) => { finished = true; return result })

  await new Promise<void>((resolve) => setImmediate(resolve))
  assert.equal(finished, false)
  finishGroups()
  const result = await running
  assert.deepEqual(result.outcomes, {
    events: 'failed_or_partial',
    groups: 'complete',
    sponsors: 'complete',
  })
  assert.equal(result.failures.length, 1)
  assert.equal(result.failures[0].collection, 'events')
})

test('combined sync reports success when every writer completes', async () => {
  const result = await runAllSyncs({
    events: async () => {}, groups: async () => {}, sponsors: async () => {},
  })
  assert.deepEqual(result.outcomes, {
    events: 'complete', groups: 'complete', sponsors: 'complete',
  })
  assert.deepEqual(result.failures, [])
})
