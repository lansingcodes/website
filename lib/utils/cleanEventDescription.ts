export function cleanEventDescription(description: string): string {
  let result = description.trim()
  result = result.replace(/\.\.\./g, '')
  // Remove emoji
  result = result.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF])/g,
    '',
  )
  // Remove all text after the last '.'
  result = result.replace(/\.(?=[^.]*$)(.*)/g, '')
  // Remove --- and all subsequent text
  result = result.replace(/(---)(.*)/g, '')
  result = result.trim()
  result = result.concat('...')
  return result
}
