import test from 'node:test'
import assert from 'node:assert/strict'
import { cleanEventDescription } from '../lib/utils/cleanEventDescription.ts'

test('keeps internal periods in technology names and version numbers', () => {
  assert.equal(
    cleanEventDescription('Learn Node.js and build web apps'),
    'Learn Node.js and build web apps...',
  )
  assert.equal(
    cleanEventDescription('Discuss version 2.0 migration'),
    'Discuss version 2.0 migration...',
  )
})

test('still removes an incomplete trailing sentence', () => {
  assert.equal(
    cleanEventDescription('Bring a laptop. Ask questions about Node.js'),
    'Bring a laptop...',
  )
  assert.equal(
    cleanEventDescription('Learn Node.js. Build an app.'),
    'Learn Node.js. Build an app...',
  )
})
