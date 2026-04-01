import { NextRequest, NextResponse } from 'next/server'
import { checkSyncSecret } from '@/lib/api/auth'
import { syncEvents } from '@/lib/sync/events'
import { syncGroups } from '@/lib/sync/groups'
import { syncSponsors } from '@/lib/sync/sponsors'

export async function POST(request: NextRequest) {
  if (!checkSyncSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await Promise.all([syncEvents(), syncGroups(), syncSponsors()])
    return NextResponse.json({ message: 'successfully loaded all data' })
  } catch (error) {
    console.error('Failed to sync all:', error)
    return NextResponse.json({ error: 'Failed to sync all' }, { status: 500 })
  }
}
