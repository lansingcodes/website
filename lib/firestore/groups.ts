import { getFirestore } from '@/lib/firebase/admin'

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
  const db = getFirestore()
  const snapshot = await db.collection('groups').get()
  const groups = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Group, 'id'>),
  }))
  return groups.sort((a, b) =>
    a.name.toLowerCase().replace(/[^a-z]/g, '').localeCompare(
      b.name.toLowerCase().replace(/[^a-z]/g, ''),
    ),
  )
}
