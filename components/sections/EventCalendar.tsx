import {
  startOfWeek,
  endOfWeek,
  isBefore,
  isAfter,
  addDays,
  addWeeks,
  isSameDay,
  format as formatDate,
} from 'date-fns'
import chunk from 'lodash/chunk'
import { sameCommunityEvent } from '@/lib/utils/simplifiedName'
import CalendarEvent, { type EventEntry } from './CalendarEvent'
import maxCalendarWeeks from '@/config/max-calendar-weeks'
import type { Event } from '@/lib/firestore/events'
import type { Group } from '@/lib/firestore/groups'
import { inLansing } from '@/config/time-zone'

interface EventCalendarProps {
  now: number
  events: Event[]
  groups: Group[]
}

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function buildCalendar(events: Event[], now: number): Date[][] {
  const startDate = startOfWeek(now, { in: inLansing })
  const defaultEnd = endOfWeek(
    addWeeks(startDate, maxCalendarWeeks - 1, { in: inLansing }),
    { in: inLansing },
  )
  const lastEvent = events[events.length - 1]
  let endDate = defaultEnd
  if (lastEvent) {
    const lastEventEnd = endOfWeek(lastEvent.startTime, { in: inLansing })
    endDate = isAfter(lastEventEnd, defaultEnd) ? lastEventEnd : defaultEnd
  }

  const dates: Date[] = []
  for (
    let days = 0, current = startDate;
    isBefore(current, endDate);
    days++, current = addDays(startDate, days, { in: inLansing })
  ) {
    dates.push(current)
  }
  return chunk(dates, 7)
}

function eventsOnDay(day: Date, events: Event[]): EventEntry[] {
  type IndexedEntry = EventEntry & { firstIndex: number }
  const dayEvents = events.filter((event) =>
    isSameDay(event.startTime, day, { in: inLansing }),
  )
  const matchingEvents: IndexedEntry[] = []

  // Find shared events before grouping a group's other events on this day.
  dayEvents.forEach((event, index) => {
    const match = matchingEvents.find((entry) =>
      sameCommunityEvent(entry.events[0], event),
    )
    if (match) {
      match.events.push(event)
    } else {
      matchingEvents.push({ type: 'single', events: [event], firstIndex: index })
    }
  })

  const entries: IndexedEntry[] = matchingEvents
    .filter((entry) => entry.events.length > 1)
    .map((entry) => ({ ...entry, type: 'community' }))

  for (const entry of matchingEvents.filter(
    (candidate) => candidate.events.length === 1,
  )) {
    const event = entry.events[0]
    const groupEntry = entries.find(
      (candidate) =>
        candidate.type !== 'community' &&
        candidate.events[0].group === event.group,
    )
    if (groupEntry) {
      groupEntry.type = 'group'
      groupEntry.events.push(event)
    } else {
      entries.push(entry)
    }
  }

  return entries
    .sort((first, second) => first.firstIndex - second.firstIndex)
    .map(({ type, events }) => ({ type, events }))
}

export default function EventCalendar({ events, groups, now }: EventCalendarProps) {
  const startDate = startOfWeek(now, { in: inLansing })
  const calendar = buildCalendar(events, now)

  const formatDayLabel = (day: Date): string => {
    const dayOfMonth = formatDate(day, 'd', { in: inLansing })
    const isStartDate = isSameDay(day, startDate, { in: inLansing })
    return dayOfMonth === '1' || isStartDate
      ? formatDate(day, 'MMM d', { in: inLansing })
      : dayOfMonth
  }

  const isDuringActivePeriod = (day: Date): boolean =>
    isAfter(day, now) || isSameDay(day, now, { in: inLansing })

  const isToday = (day: Date): boolean => isSameDay(day, now, { in: inLansing })
  const isWeekday = (day: Date): boolean => +formatDate(day, 'i', { in: inLansing }) <= 5

  return (
    <div>
      <div className="flex">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            className="w-1/7 text-center text-white font-semibold"
          >
            {label}
          </div>
        ))}
      </div>
      {calendar.map((week, weekIndex) => (
        <div key={weekIndex} className="flex">
          {week.map((day) => (
            <div
              key={day.getTime()}
              className={`w-1/7 min-h-16 m-1 p-1 rounded-sm border-attention shadow-md ${
                isToday(day)
                  ? 'border-4 bg-white'
                  : isWeekday(day)
                  ? 'bg-white'
                  : 'bg-grey-light'
              }`}
            >
              <div>
                <div className="text-gray-900 text-center mb-2 font-medium text-sm">
                  {formatDayLabel(day)}
                </div>
                {isDuringActivePeriod(day) && (
                  <ul className="m-0 p-0">
                    {eventsOnDay(day, events).map((entry) => (
                      <CalendarEvent key={entry.events[0].id} entry={entry} groups={groups} />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
