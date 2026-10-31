// Meetup iCal LOCATION format is "Venue Name (Address)", so we split on
// the last "(" to extract just the venue name.
export function parseVenue(location: string): string {
  if (!location) return ''
  const from = location.lastIndexOf('(')
  const to = location.lastIndexOf(')')
  const venue = from >= 0 && to > from ? location.substring(0, from) : location
  return venue.replace(/\\/g, '').trim()
}
