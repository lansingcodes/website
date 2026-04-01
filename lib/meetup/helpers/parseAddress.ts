// Extracts the parenthesized address from Meetup iCal LOCATION, e.g.
// "Venue Name (123 Main St, Lansing MI)" → "123 Main St, Lansing MI"
export function parseAddress(location: string): string {
  if (!location) return ''
  const from = location.lastIndexOf('(')
  const to = location.lastIndexOf(')')
  if (from === -1 && to === -1) return ''
  const address = location.substring(from + 1, to)
  return address.replace(/\\/g, '')
}
