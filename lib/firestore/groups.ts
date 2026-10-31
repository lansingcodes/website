import { getStore } from '@/lib/store'

export interface Group {
  id: string
  name: string
  description: string
  iconSet?: string
  iconName?: string
  iconText?: string
  url: string
  schedule?: string
  slug?: string
  youtube?: string
}

export async function getAllGroups(): Promise<Group[]> {
  const groups = await getStore().listDocs<Omit<Group, 'id'>>('groups')
  return groups.sort((a, b) =>
    a.name.toLowerCase().replace(/[^a-z]/g, '').localeCompare(
      b.name.toLowerCase().replace(/[^a-z]/g, ''),
    ),
  )
}
