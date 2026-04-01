import type { Config } from '@netlify/functions'

// Runs every 2 hours to sync Meetup events, groups, and sponsors to Firestore
export default async function handler() {
  const baseUrl = process.env.URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const syncSecret = process.env.SYNC_SECRET

  if (!syncSecret) {
    console.error('SYNC_SECRET not set — skipping scheduled sync')
    return
  }

  try {
    const response = await fetch(`${baseUrl}/api/sync/all`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${syncSecret}`,
      },
    })

    if (!response.ok) {
      const body = await response.text()
      console.error('Scheduled sync failed:', response.status, body)
    } else {
      console.log('Scheduled sync succeeded')
    }
  } catch (error) {
    console.error('Scheduled sync error:', error)
  }
}

export const config: Config = {
  schedule: '0 */2 * * *', // Every 2 hours
}
