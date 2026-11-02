import { NextRequest, NextResponse } from 'next/server'
import { checkSyncSecret } from '@/lib/api/auth'
import { syncEvents } from '@/lib/sync/events'
import { syncGroups } from '@/lib/sync/groups'
import { syncSponsors } from '@/lib/sync/sponsors'
import { runAllSyncs } from '@/lib/sync/all'

export async function POST(request: NextRequest) {
  if (!checkSyncSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { outcomes, failures } = await runAllSyncs({
    events: syncEvents,
    groups: syncGroups,
    sponsors: syncSponsors,
  })
  if (failures.length > 0) {
    for (const { collection, error } of failures) {
      console.error(`Combined sync ${collection} failed or partially completed:`, error)
    }
    console.error('Combined sync outcomes:', outcomes)
    return NextResponse.json({ error: 'Combined sync incomplete', outcomes }, { status: 500 })
  }

  return NextResponse.json({ message: 'successfully loaded all data', outcomes })
}
