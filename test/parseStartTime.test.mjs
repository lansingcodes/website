import assert from 'node:assert/strict'
import { test } from 'node:test'
import ical2json from 'ical2json'
import { parseStartTime } from '../lib/meetup/helpers/parseStartTime.ts'

function eventWithStart(property) {
  const ical = `BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:test\r\n${property}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`
  return ical2json.convert(ical).VCALENDAR[0].VEVENT[0]
}

test('parses TZID before another DTSTART parameter', () => {
  const event = eventWithStart('DTSTART;TZID=America/Detroit;VALUE=DATE-TIME:20270301T003000')
  assert.equal(parseStartTime(event), Date.parse('2027-03-01T05:30:00Z'))
})

test('parses TZID after another DTSTART parameter', () => {
  const event = eventWithStart('DTSTART;VALUE=DATE-TIME;TZID=America/Detroit:20270301T003000')
  assert.equal(parseStartTime(event), Date.parse('2027-03-01T05:30:00Z'))
})
