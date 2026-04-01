import { NextRequest } from 'next/server'
import { timingSafeEqual } from 'crypto'

export function checkSyncSecret(request: NextRequest): boolean {
  const secret = process.env.SYNC_SECRET
  if (!secret) return false
  const auth = request.headers.get('Authorization')
  if (!auth) return false

  const expected = `Bearer ${secret}`
  if (auth.length !== expected.length) return false

  return timingSafeEqual(Buffer.from(auth), Buffer.from(expected))
}
