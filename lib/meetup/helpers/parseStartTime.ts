// moment-timezone is used here (instead of date-fns) because it can parse
// iCal datetime strings with TZID timezone identifiers, e.g. "20250401T190000".
import moment from 'moment-timezone'

const tzDelim = ';TZID='

export function parseStartTime(vevent: Record<string, string>): number | undefined {
  const dtstartKey = Object.keys(vevent).find((key) => key.startsWith('DTSTART'))
  if (!dtstartKey) return undefined
  const timezoneIndex = dtstartKey.indexOf(tzDelim)
  const timezoneName =
    timezoneIndex >= 0
      ? dtstartKey.slice(timezoneIndex + tzDelim.length)
      : undefined
  const dtstart = vevent[dtstartKey]
  if (dtstart.length < 15) return undefined

  const startTime = timezoneName
    ? moment.tz(dtstart, timezoneName)
    : moment(dtstart)
  return startTime.valueOf()
}
