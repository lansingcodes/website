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

test('an event without UID aborts replacement', () => {
  const feed = 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:20270101T180000\nEND:VEVENT\nEND:VCALENDAR'
  assert.throws(() => icalToEvents('devops', feed), /missing UID/)
})

test('events with missing or invalid start times abort replacement', () => {
  for (const start of ['', 'DTSTART:invalid']) {
    const feed = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:event-1\n${start ? `${start}\n` : ''}END:VEVENT\nEND:VCALENDAR`
    assert.throws(() => icalToEvents('devops', feed), /invalid DTSTART/)
  }
})
