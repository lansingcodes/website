import axios from 'axios'
import { icalToEvents } from './icalToEvents'

const meetupClient = axios.create({
  baseURL: 'https://www.meetup.com',
})

export async function fetchEventsForGroup(
  groupKey: string,
  group: { slug?: string },
): Promise<Record<string, unknown>> {
  if (!group.slug) return {}

  try {
    const response = await meetupClient.get(`/${group.slug}/events/ical/`)
    return icalToEvents(groupKey, response.data)
  } catch (error) {
    console.error(`Failed to get events for group ${groupKey}:`, error)
    return {}
  }
}
