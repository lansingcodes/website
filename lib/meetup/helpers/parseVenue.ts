// Meetup iCal LOCATION format is "Venue Name (Address)", so we split on
// the last "(" to extract just the venue name.
export function parseVenue(location: string): string {
  if (!location) return ''
  const to = location.lastIndexOf('(')
  const venue = to >= 0 ? location.substring(0, to) : location
  return venue.replace(/\\/g, '').trim()
}
