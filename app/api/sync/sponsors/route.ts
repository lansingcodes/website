import { NextRequest, NextResponse } from 'next/server'
import { checkSyncSecret } from '@/lib/api/auth'
import { syncSponsors } from '@/lib/sync/sponsors'

export async function POST(request: NextRequest) {
  if (!checkSyncSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await syncSponsors()
    return NextResponse.json({ message: 'successfully loaded sponsors' })
  } catch (error) {
    console.error('Failed to sync sponsors:', error)
    return NextResponse.json({ error: 'Failed to sync sponsors' }, { status: 500 })
  }
}
