import { fetchEventsForGroup } from './fetchEventsForGroup'
import groups from '@/data/groups.json'

export async function fetchEventsForAllGroups(): Promise<Record<string, unknown>> {
  const results = await Promise.all(
    Object.entries(groups as Record<string, { slug?: string }>).map(
      ([groupKey, group]) => fetchEventsForGroup(groupKey, group),
    ),
  )
  return results.reduce(
    (acc, current) => Object.assign(acc, current),
    {} as Record<string, unknown>,
  )
}
