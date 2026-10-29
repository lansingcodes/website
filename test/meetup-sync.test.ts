import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchEventsForGroup } from '../lib/meetup/fetchEventsForGroup'
import { icalToEvents } from '../lib/meetup/icalToEvents'

test('a failed Meetup feed aborts event replacement', async () => {
  await assert.rejects(
    fetchEventsForGroup('devops', { slug: 'devops' }, async () => {
      throw new Error('Meetup unavailable')
    }),
    /Meetup unavailable/,
  )
})

test('a malformed calendar aborts event replacement', () => {
  assert.throws(() => icalToEvents('devops', 'not a calendar'), /without VCALENDAR/)
})

test('a valid empty calendar remains a valid result', () => {
  assert.deepEqual(icalToEvents('devops', 'BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR'), {})
})
