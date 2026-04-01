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
import { simplifiedName } from '@/lib/utils/simplifiedName'
import CalendarEvent, { type EventEntry } from './CalendarEvent'
import maxCalendarWeeks from '@/config/max-calendar-weeks'
import type { Event } from '@/lib/firestore/events'
import type { Group } from '@/lib/firestore/groups'

interface EventCalendarProps {
  now: number
  events: Event[]
  groups: Group[]
}

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function buildCalendar(events: Event[], now: number): Date[][] {
  const startDate = startOfWeek(now)
  const defaultEnd = endOfWeek(addWeeks(startDate, maxCalendarWeeks - 1))
  const lastEvent = events[events.length - 1]
  let endDate = defaultEnd
  if (lastEvent) {
    const lastEventEnd = endOfWeek(new Date(lastEvent.startTime))
    endDate = isAfter(lastEventEnd, defaultEnd) ? lastEventEnd : defaultEnd
  }

  const dates: Date[] = []
  for (
    let days = 0, current = startDate;
    isBefore(current, endDate);
    days++, current = addDays(startDate, days)
  ) {
    dates.push(current)
  }
  return chunk(dates, 7)
}

function eventsOnDay(day: Date, events: Event[]): EventEntry[] {
  return events
    .filter((event) => isSameDay(new Date(event.startTime), day))
    // Group events into three display types:
    //  - "community": multiple groups hosting the same event at the same time
    //    (matched by normalized name + identical startTime)
    //  - "group": same group hosting multiple events on one day
    //  - "single": a standalone event (the default)
    .reduce((acc: EventEntry[], event) => {
      const communityEvent = acc.find((candidate) => {
        const first = candidate.events[0]
        return (
          ['single', 'community'].includes(candidate.type) &&
          first.startTime === event.startTime &&
          simplifiedName(event.name) === simplifiedName(first.name)
        )
      })
      if (communityEvent) {
        communityEvent.type = 'community'
        communityEvent.events.push(event)
        return acc
      }

      const groupEvent = acc.find(
        (candidate) =>
          ['single', 'group'].includes(candidate.type) &&
          candidate.events[0].group === event.group,
      )
      if (groupEvent) {
        groupEvent.type = 'group'
        groupEvent.events.push(event)
        return acc
      }

      acc.push({ type: 'single', events: [event] })
      return acc
    }, [])
}

export default function EventCalendar({ events, groups, now }: EventCalendarProps) {
  const startDate = startOfWeek(now)
  const calendar = buildCalendar(events, now)

  const formatDayLabel = (day: Date): string => {
    const dayOfMonth = formatDate(day, 'd')
    const isStartDate = isSameDay(day, startDate)
    return dayOfMonth === '1' || isStartDate
      ? formatDate(day, 'MMM d')
      : dayOfMonth
  }

  const isDuringActivePeriod = (day: Date): boolean =>
    isAfter(day, now) || isSameDay(day, now)

  const isToday = (day: Date): boolean => isSameDay(day, now)
  const isWeekday = (day: Date): boolean => +formatDate(day, 'i') <= 5

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
