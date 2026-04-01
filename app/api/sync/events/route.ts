import { NextRequest, NextResponse } from 'next/server'
import { checkSyncSecret } from '@/lib/api/auth'
import { syncEvents } from '@/lib/sync/events'

export async function POST(request: NextRequest) {
  if (!checkSyncSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await syncEvents()
    return NextResponse.json({ message: 'successfully loaded events' })
  } catch (error) {
    console.error('Failed to sync events:', error)
    return NextResponse.json({ error: 'Failed to sync events' }, { status: 500 })
  }
}
