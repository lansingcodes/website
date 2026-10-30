import ical2json from 'ical2json'
import { parseName } from './helpers/parseName'
import { parseDescription } from './helpers/parseDescription'
import { parseVenue } from './helpers/parseVenue'
import { parseAddress } from './helpers/parseAddress'
import { parseStartTime } from './helpers/parseStartTime'
import type { Event } from '@/lib/types'

export function icalToEvents(groupKey: string, ical: string): Record<string, Omit<Event, 'id'> & { id: string }> {
  const icalJson = ical2json.convert(ical)
  if (!icalJson.VCALENDAR) return {}

  const events: Record<string, Omit<Event, 'id'> & { id: string }> = {}
  ;(icalJson.VCALENDAR as Record<string, unknown>[]).forEach((calendar: Record<string, unknown>) => {
    if (!calendar.VEVENT) return
    ;(calendar.VEVENT as Record<string, string>[]).forEach((vevent) => {
      const id = vevent.UID
      if (!id) return
      const startTime = parseStartTime(vevent)
      if (!startTime) return
      const event = {
        id,
        group: groupKey,
        name: parseName(vevent.SUMMARY || ''),
        description: parseDescription(vevent.DESCRIPTION || ''),
        url: vevent['URL;VALUE=URI'] || vevent.URL || '',
        venue: parseVenue(vevent.LOCATION || ''),
        address: parseAddress(vevent.LOCATION || ''),
        startTime,
      }
      events[id] = event
    })
  })
  return events
}
