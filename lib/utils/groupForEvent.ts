import type { Event } from '@/lib/firestore/events'
import type { Group } from '@/lib/firestore/groups'

export function groupForEvent(event: Event, groups: Group[]): Group | undefined {
  return groups.find((group) => group.id === event.group)
}
