import { getStore } from '@/lib/store'
import type { StoredDoc } from '@/lib/store/types'
import groups from '@/data/groups.json'

// Full-replace sync: write all groups from data/groups.json, removing any
// stored group not in the JSON (e.g. if a group was removed).
export async function syncGroups() {
  await getStore().replaceCollection('groups', groups as Record<string, StoredDoc>)
}
