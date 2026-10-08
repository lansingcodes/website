import type { Group } from '@/lib/types'
import rawGroups from '@/data/groups.json'

export async function getAllGroups(): Promise<Group[]> {
  const groups: Group[] = Object.entries(rawGroups).map(([id, group]) => ({
    id,
    ...group,
  }))

  return groups.sort((a, b) =>
    a.name.toLowerCase().replace(/[^a-z]/g, '').localeCompare(
      b.name.toLowerCase().replace(/[^a-z]/g, ''),
    ),
  )
}
