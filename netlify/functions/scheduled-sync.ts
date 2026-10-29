import type { Config } from '@netlify/functions'

// Runs every 2 hours to sync Meetup events, groups, and sponsors to Firestore
export default async function handler() {
  const baseUrl = process.env.URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const syncSecret = process.env.SYNC_SECRET

  try {
    if (!syncSecret) throw new Error('SYNC_SECRET not set')

    const response = await fetch(`${baseUrl}/api/sync/all`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${syncSecret}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Sync endpoint returned HTTP ${response.status}`)
    } else {
      console.log(`Scheduled sync succeeded (Node ${process.version})`)
    }
  } catch (error) {
    console.error('Scheduled sync failed:', error)
    throw error
  }
}

export const config: Config = {
  schedule: '0 */2 * * *', // Every 2 hours
}
