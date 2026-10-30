import type { Sponsor } from '@/lib/types'
import rawSponsors from '@/data/sponsors.json'

export async function getAllSponsors(): Promise<Sponsor[]> {
  const sponsors: Sponsor[] = Object.entries(rawSponsors).map(([id, sponsor]) => ({
    id,
    ...sponsor,
  }))

  return sponsors.sort((a, b) => a.name.localeCompare(b.name))
}
