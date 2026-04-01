import SectionHeading from '@/components/SectionHeading'
import EventCalendar from './EventCalendar'
import EventList from './EventList'
import type { Event } from '@/lib/firestore/events'
import type { Group } from '@/lib/firestore/groups'

interface EventsProps {
  now: number
  events: Event[]
  groups: Group[]
}

export default function Events({ events, groups, now }: EventsProps) {
  return (
    <section id="events" className="sm:-mt-48">
      <div className="lc-bg-right-triangle bg-transparent h-64" />
      <div className="lc-bg-ltr-gradient">
        <div className="container mx-auto">
          <SectionHeading
            white
            heading="Upcoming Events"
            subheading="events and resources for Lansing coders"
          />
          <div className="w-full">
            <div className="hidden lg:block">
              <EventCalendar events={events} groups={groups} now={now} />
            </div>
            <div className="block lg:hidden">
              <EventList events={events} groups={groups} />
            </div>
          </div>
        </div>
      </div>
      <div className="lc-bg-down-triangle bg-white h-64 -mt-32" />
    </section>
  )
}
