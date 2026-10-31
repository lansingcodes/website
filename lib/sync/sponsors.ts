import { getStore } from '@/lib/store'
import type { StoredDoc } from '@/lib/store/types'
import sponsors from '@/data/sponsors.json'

// Full-replace sync: write all sponsors from data/sponsors.json, removing any
// stored sponsor not in the JSON (e.g. if a sponsor was removed).
export async function syncSponsors() {
  await getStore().replaceCollection('sponsors', sponsors as Record<string, StoredDoc>)
}
