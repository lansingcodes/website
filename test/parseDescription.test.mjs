import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseDescription } from '../lib/meetup/helpers/parseDescription.ts'

const paragraph = '\\n\\n'

test('keeps an event body when its iCal description has no footer', () => {
  assert.equal(parseDescription(`Header${paragraph}Useful event details`), 'Useful event details')
})

test('still removes the header and footer when both are present', () => {
  assert.equal(parseDescription(`Header${paragraph}Useful event details${paragraph}Footer`), 'Useful event details')
})

test('keeps descriptions without section breaks', () => {
  assert.equal(parseDescription('Useful event details'), 'Useful event details')
})
