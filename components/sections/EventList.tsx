import CardEvent from '@/components/cards/CardEvent'
import { groupForEvent } from '@/lib/utils/groupForEvent'
import type { Event } from '@/lib/firestore/events'
import type { Group } from '@/lib/firestore/groups'

interface EventListProps {
  events: Event[]
  groups: Group[]
}

export default function EventList({ events, groups }: EventListProps) {
  return (
    <div className="flex flex-wrap align-start justify-around px-4">
      {events.map((event) => (
        <CardEvent
          key={event.id}
          event={event}
          group={groupForEvent(event, groups)}
        />
      ))}
    </div>
  )
}
