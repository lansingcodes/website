// Meetup iCal DESCRIPTION has three sections separated by double-newlines:
//   1. Header (event title / meetup link)
//   2. Event description (what we want)
//   3. Footer (RSVP link / boilerplate)
// We extract just the middle section by finding the first and last "\n\n".
const breakPoint = '\\n\\n'

export function parseDescription(originalDescription: string): string {
  if (!originalDescription) return ''
  const from = originalDescription.indexOf(breakPoint)
  const to = originalDescription.lastIndexOf(breakPoint)
  const description = originalDescription.substring(
    from === -1 ? 0 : from + breakPoint.length,
    to === -1 ? originalDescription.length : to,
  )
  return description.replace(/\\n/g, '\n').replace(/\\/g, '')
}
