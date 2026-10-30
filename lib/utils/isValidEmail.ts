// Accepts exactly what /^[^\s@]+@[^\s@]+\.[^\s@]+$/ does, in linear time (that regex backtracks quadratically)
export function isValidEmail(email: string): boolean {
  if (!/^[^\s@]+@[^\s@]+$/.test(email)) return false
  const domain = email.slice(email.indexOf('@') + 1)
  const dot = domain.indexOf('.', 1)
  return dot !== -1 && dot < domain.length - 1
}
