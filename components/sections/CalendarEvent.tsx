import LogoExtraSmall from '@/components/logos/LogoExtraSmall'
import { formatTimeOfEvent } from '@/lib/utils/formatDateTime'
import { groupForEvent } from '@/lib/utils/groupForEvent'
import { orderBy } from 'lodash'
import type { Event, Group } from '@/lib/types'

export type EventEntry = {
  type: 'single' | 'community' | 'group'
  events: Event[]
}

interface CalendarEventProps {
  entry: EventEntry
  groups: Group[]
}

export default function CalendarEvent({ entry, groups }: CalendarEventProps) {
  const { type, events } = entry
  const firstEvent = events[0]
  const additionalEvents = events.slice(1)
  const firstGroup = groupForEvent(firstEvent, groups)

  const sortedEvents =
    type === 'community'
      ? orderBy(events, [
          (e) =>
            groupForEvent(e, groups)
              ?.name.toLowerCase()
              .replace(/[^a-z]/g, '') || '',
        ])
      : events

  const formatTimes = () =>
    additionalEvents.map((e) => formatTimeOfEvent(e.startTime)).join(', ')

  const eventName =
    type === 'community'
      ? firstEvent.name
      : firstGroup
        ? firstGroup.name
        : firstEvent.name

  return (
    <li className="group relative block list-none mx-1 py-2 border-t border-blue hover:bg-blue-50">
      <a
        href={firstEvent.url}
        className="block cursor-pointer no-underline hover:underline text-inherit hover:text-blue"
        target="_blank"
        rel="noreferrer noopener"
        title={firstEvent.name}
      >
        {type === 'community' ? (
          <span>
            <LogoExtraSmall iconSet="lansing-codes" iconName="icon-lansing-codes-logo" />
          </span>
        ) : firstGroup ? (
          <span>
            <LogoExtraSmall
              iconSet={firstGroup.iconSet}
              iconName={firstGroup.iconName}
              iconText={firstGroup.iconText}
            />
          </span>
        ) : null}

        <span className="text-xs">{formatTimeOfEvent(firstEvent.startTime)}</span>

        <div className="mt-1 text-sm">{eventName}</div>

        {type === 'group' && additionalEvents.length > 0 && (
          <div className="text-xs">
            <aside className="italic">also: {formatTimes()}</aside>
          </div>
        )}
        {type === 'community' && (
          <div className="text-xs">
            <aside className="italic">{events.length} ways to join</aside>
          </div>
        )}
      </a>

      {/* Tooltip on hover — shows event details */}
      <div className="hidden group-hover:block absolute z-10 text-blue-800 border border-blue shadow-md bg-white p-2 w-56">
        <ul className="m-0 p-0">
          {sortedEvents.map((event, index) => {
            const evGroup = groupForEvent(event, groups)
            return (
              <li
                key={event.id}
                className={`block list-none mx-1 py-2 border-blue hover:bg-blue-50${index > 0 ? ' border-t' : ''}`}
              >
                <a
                  href={event.url}
                  className="w-full block no-underline text-blue-800"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {type === 'community' && evGroup ? (
                    <span>
                      <LogoExtraSmall
                        iconSet={evGroup.iconSet}
                        iconName={evGroup.iconName}
                        iconText={evGroup.iconText}
                      />
                      {evGroup.name}
                    </span>
                  ) : type === 'group' ? (
                    <span>
                      {formatTimeOfEvent(event.startTime)} {event.name}
                    </span>
                  ) : (
                    <span>{event.name}</span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}
