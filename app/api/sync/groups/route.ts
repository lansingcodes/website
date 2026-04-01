import { NextRequest, NextResponse } from 'next/server'
import { checkSyncSecret } from '@/lib/api/auth'
import { syncGroups } from '@/lib/sync/groups'

export async function POST(request: NextRequest) {
  if (!checkSyncSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await syncGroups()
    return NextResponse.json({ message: 'successfully loaded groups' })
  } catch (error) {
    console.error('Failed to sync groups:', error)
    return NextResponse.json({ error: 'Failed to sync groups' }, { status: 500 })
  }
}
