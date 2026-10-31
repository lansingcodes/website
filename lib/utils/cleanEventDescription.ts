export function cleanEventDescription(description: string): string {
  let result = description.trim()
  result = result.replace(/\.\.\./g, '')
  // Remove emoji
  result = result.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF])/g,
    '',
  )
  // Drop an incomplete trailing sentence without treating Node.js or 2.0 as a sentence break.
  const lastSentenceEnd = [...result.matchAll(/\.(?=\s|$)/g)].at(-1)
  if (lastSentenceEnd) result = result.slice(0, lastSentenceEnd.index)
  // Remove --- and all subsequent text
  result = result.replace(/(---)(.*)/g, '')
  result = result.trim()
  result = result.concat('...')
  return result
}
