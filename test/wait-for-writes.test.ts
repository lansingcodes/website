import test from 'node:test'
import assert from 'node:assert/strict'
import { waitForWrites } from '../lib/sync/waitForWrites'

test('a rejected writer waits for a delayed sibling before propagating failure', async () => {
  let finishSibling: (() => void) | undefined
  let siblingFinished = false
  let errorObserved = false
  const failed = new Error('write rejected')
  const writing = waitForWrites([
    async () => { throw failed },
    () => new Promise<void>(resolve => {
      finishSibling = () => { siblingFinished = true; resolve() }
    }),
  ]).catch(error => {
    errorObserved = true
    throw error
  })

  await new Promise(resolve => setImmediate(resolve))
  assert.equal(errorObserved, false)
  assert.equal(siblingFinished, false)
  assert.ok(finishSibling)
  finishSibling()
  await assert.rejects(writing, error => error === failed)
  assert.equal(siblingFinished, true)
})
