import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseAddress } from '../lib/meetup/helpers/parseAddress.ts'
import { parseVenue } from '../lib/meetup/helpers/parseVenue.ts'

test('extracts venue and address from a balanced Meetup location', () => {
  const location = 'Venue (123 Main St, Lansing MI)'
  assert.equal(parseVenue(location), 'Venue')
  assert.equal(parseAddress(location), '123 Main St, Lansing MI')
})

test('keeps an incomplete location visible without inventing an address', () => {
  const location = 'Venue (123 Main St, Lansing MI'
  assert.equal(parseVenue(location), location)
  assert.equal(parseAddress(location), '')
})

test('does not treat a lone closing parenthesis as an address', () => {
  assert.equal(parseVenue('Venue)'), 'Venue)')
  assert.equal(parseAddress('Venue)'), '')
})
