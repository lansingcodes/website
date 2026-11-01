import type { Event, Group } from '@/lib/types'

export function groupForEvent(event: Event, groups: Group[]): Group | undefined {
  return groups.find((group) => group.id === event.group)
}
